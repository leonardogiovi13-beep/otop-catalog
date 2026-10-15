import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // รันในเครื่อง (localhost) -> ใช้ backend ในเครื่อง, ขึ้นเว็บจริง -> ใช้ backend บน Render
  private readonly RENDER_URL = 'https://otop-backend.onrender.com';
  private readonly baseUrl =
    typeof location !== 'undefined' && location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : this.RENDER_URL;
  private apiUrl = `${this.baseUrl}/product`;
  private loginUrl = `${this.baseUrl}/login`;
  private registerUrl = `${this.baseUrl}/register`;

  constructor(private http: HttpClient) {}

  // สมัครสมาชิกทั่วไป
  register(userData: any): Observable<any> {
    return this.http.post<any>(this.registerUrl, userData);
  }

  // เข้าสู่ระบบ (ทั้ง User ทั่วไป และ Admin)
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { username, password });
  }

  // ดึงข้อมูลโปรไฟล์ผู้ใช้ปัจจุบัน
  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/auth/me`, this.getAuthHeaders());
  }

  // ฟังก์ชันดึง Token จากเบราว์เซอร์
  private getAuthHeaders() {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    return {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    };
  }

  getProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // 👇 จัดการข้อมูลสินค้า (ต้องแนบ Token สิทธิ์ Admin)
  addProduct(productData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, productData, this.getAuthHeaders());
  }

  updateProduct(id: number, productData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, productData, this.getAuthHeaders());
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}