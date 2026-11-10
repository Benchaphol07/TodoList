import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import * as signalR from '@microsoft/signalr';

interface Task { id: number; title: string; description: string; status: number; }

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/todos';
  private hubUrl = 'http://localhost:5000/hub';
  private hub?: signalR.HubConnection;

  columns = [
    { status: 0, name: 'TO DO', color: '#6b7280' },
    { status: 1, name: 'IN PROGRESS', color: '#3b82f6' },
    { status: 2, name: 'DONE', color: '#22c55e' }
  ];

  tasks: Task[] = [];
  connected = false;

  // drag & drop
  dragged?: Task;
  overStatus = -1;

  // modal
  showModal = false;
  editing?: Task;
  title = '';
  description = '';
  status = 0;

  ngOnInit() {
    this.load();
    this.connectRealtime();
  }

  ngOnDestroy() { this.hub?.stop(); }

  // ---------- Realtime (SignalR) ----------
  private connectRealtime() {
    this.hub = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .withAutomaticReconnect()
      .build();

    // server แจ้งว่ามีการเปลี่ยนแปลง (จากเรา หรือจากคนอื่น) -> โหลดข้อมูลใหม่
    this.hub.on('changed', () => this.load());
    this.hub.onreconnecting(() => this.connected = false);
    this.hub.onreconnected(() => { this.connected = true; this.load(); });
    this.hub.onclose(() => this.connected = false);

    this.hub.start().then(() => this.connected = true).catch(() => this.connected = false);
  }

  // ---------- Read ----------
  load() { this.http.get<Task[]>(this.apiUrl).subscribe(r => this.tasks = r); }

  byStatus(s: number) { return this.tasks.filter(t => t.status === s); }

  // ---------- Create / Update ----------
  openCreate(status = 0) {
    this.editing = undefined;
    this.title = '';
    this.description = '';
    this.status = status;
    this.showModal = true;
  }

  openEdit(t: Task) {
    this.editing = t;
    this.title = t.title;
    this.description = t.description ?? '';
    this.status = t.status;
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  save() {
    if (!this.title.trim()) return;
    const body = { id: this.editing?.id ?? 0, title: this.title.trim(),
                   description: this.description.trim(), status: this.status };
    const req = this.editing
      ? this.http.put(`${this.apiUrl}/${this.editing.id}`, body)
      : this.http.post(this.apiUrl, body);
    req.subscribe(() => { this.closeModal(); this.load(); });
  }

  // ---------- Drag & Drop = เปลี่ยนสถานะ ----------
  onOver(e: DragEvent, status: number) { e.preventDefault(); this.overStatus = status; }

  endDrag() { this.dragged = undefined; this.overStatus = -1; }

  drop(status: number) {
    const t = this.dragged;
    this.endDrag();
    if (!t || t.status === status) return;
    t.status = status;                                   // อัปเดตหน้าจอทันที (ไม่ต้องรอ)
    this.http.put(`${this.apiUrl}/${t.id}`, t).subscribe({
      next: () => this.load(),
      error: () => this.load()                           // ถ้าพลาดให้ดึงข้อมูลจริงกลับมา
    });
  }

  // ---------- Delete ----------
  remove(t: Task) {
    if (!confirm(`ลบ TASK-${t.id}: ${t.title} ?`)) return;
    this.tasks = this.tasks.filter(x => x.id !== t.id);  // หายจากหน้าจอทันที
    this.http.delete(`${this.apiUrl}/${t.id}`).subscribe({
      next: () => this.load(),
      error: () => this.load()
    });
  }
}
