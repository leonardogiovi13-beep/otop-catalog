import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from './services/product.service';
import { Product, CommunityProducer, MOCK_PRODUCERS } from './mock-products'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  products: Product[] = []; 
  producers: CommunityProducer[] = MOCK_PRODUCERS;
  
  selectedCategory: string = 'ทั้งหมด';
  selectedZone: string = 'ทั้งหมด';
  searchTerm: string = '';
  selectedProduct: Product | null = null;

  zones: string[] = ['ทั้งหมด', 'อ่าวไทย', 'อันดามัน', 'ชายแดนใต้'];
  categories: string[] = ['ทั้งหมด', 'อาหาร', 'เครื่องดื่ม', 'ผ้าและเครื่องแต่งกาย', 'สมุนไพร/ของใช้', 'ของประดับตกแต่ง', 'ของใช้'];

  // สถานะผู้ใช้งาน
  currentUser: any = null;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  // Login Modal
  showLoginModal: boolean = false;
  loginUser: string = '';
  loginPass: string = '';
  loginError: string = '';
  isLoggingIn: boolean = false;

  // Register Modal
  showRegisterModal: boolean = false;
  registerForm = {
    username: '',
    email: '',
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };
  registerError: string = '';
  isRegistering: boolean = false;

  showFormModal: boolean = false;
  isEditing: boolean = false;
  editingId: number | null = null;
  productForm: any = {}; 

  showAboutModal: boolean = false;
  isUploading: boolean = false;

  constructor(private productService: ProductService, private http: HttpClient) {}

  ngOnInit() {
    this.loadProducts();
    this.initAuth();
  }

  // โหลดสถานะการเข้าสู่ระบบจาก LocalStorage
  initAuth() {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('currentUser');
    if (token && savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
        this.isLoggedIn = true;
        this.isAdmin = this.currentUser.role === 'ADMIN';
      } catch {
        this.clearAuth();
      }
    } else if (token) {
      this.isLoggedIn = true;
      this.isAdmin = token === 'otop-secret-token-2026';
      this.currentUser = {
        username: 'admin',
        fullName: 'ผู้ดูแลระบบ',
        role: 'ADMIN'
      };
    }
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('ดึงข้อมูลล้มเหลว:', err)
    });
  }

  // ==========================================
  // จัดการ Modal การเข้าสู่ระบบและสมัครสมาชิก
  // ==========================================
  openLogin() {
    this.showLoginModal = true;
    this.showRegisterModal = false;
    this.loginError = '';
  }

  closeLogin() {
    this.showLoginModal = false;
    this.loginUser = '';
    this.loginPass = '';
    this.loginError = '';
  }

  openRegister() {
    this.showRegisterModal = true;
    this.showLoginModal = false;
    this.registerError = '';
    this.resetRegisterForm();
  }

  closeRegister() {
    this.showRegisterModal = false;
    this.registerError = '';
    this.resetRegisterForm();
  }

  switchToRegister() {
    this.closeLogin();
    this.openRegister();
  }

  switchToLogin() {
    this.closeRegister();
    this.openLogin();
  }

  resetRegisterForm() {
    this.registerForm = {
      username: '',
      email: '',
      fullName: '',
      phone: '',
      password: '',
      confirmPassword: ''
    };
  }

  // ==========================================
  // ฟังก์ชันสมัครสมาชิกทั่วไป
  // ==========================================
  register() {
    this.registerError = '';
    const { username, email, password, confirmPassword } = this.registerForm;

    if (!username || username.trim().length < 3) {
      this.registerError = '⚠️ ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร';
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      this.registerError = '⚠️ กรุณาระบุรูปแบบอีเมลให้ถูกต้อง';
      return;
    }

    if (!password || password.length < 6) {
      this.registerError = '⚠️ รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
      return;
    }

    if (password !== confirmPassword) {
      this.registerError = '⚠️ รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน';
      return;
    }

    this.isRegistering = true;
    this.productService.register(this.registerForm).subscribe({
      next: (res) => {
        this.isRegistering = false;
        this.currentUser = res.user;
        this.isLoggedIn = true;
        this.isAdmin = res.user.role === 'ADMIN';

        localStorage.setItem('token', res.token);
        localStorage.setItem('adminToken', res.token);
        localStorage.setItem('currentUser', JSON.stringify(res.user));

        this.closeRegister();
        alert(`🎉 ยินดีต้อนรับคุณ ${res.user.fullName || res.user.username} สมัครสมาชิกสำเร็จ!`);
      },
      error: (err) => {
        this.isRegistering = false;
        this.registerError = err.error?.message || '❌ การสมัครสมาชิกล้มเหลว กรุณาลองใหม่อีกครั้ง';
      }
    });
  }

  // ==========================================
  // ฟังก์ชันเข้าสู่ระบบ (User ทั่วไป & Admin)
  // ==========================================
  login() {
    this.loginError = '';
    if (!this.loginUser || !this.loginPass) {
      this.loginError = '⚠️ กรุณากรอกชื่อผู้ใช้และรหัสผ่าน';
      return;
    }

    this.isLoggingIn = true;
    this.productService.login(this.loginUser, this.loginPass).subscribe({
      next: (res) => {
        this.isLoggingIn = false;
        const user = res.user || {
          username: this.loginUser,
          role: this.loginUser === 'admin' ? 'ADMIN' : 'USER',
          fullName: this.loginUser === 'admin' ? 'ผู้ดูแลระบบ' : this.loginUser
        };
        this.currentUser = user;
        this.isLoggedIn = true;
        this.isAdmin = user.role === 'ADMIN';

        localStorage.setItem('token', res.token);
        localStorage.setItem('adminToken', res.token);
        localStorage.setItem('currentUser', JSON.stringify(user));

        this.closeLogin();
        alert(`✅ เข้าสู่ระบบสำเร็จ ยินดีต้อนรับคุณ ${user.fullName || user.username}`);
      },
      error: (err) => {
        this.isLoggingIn = false;
        this.loginError = err.error?.message || '❌ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
      }
    });
  }

  logout() {
    this.clearAuth();
    alert('👋 ออกจากระบบเรียบร้อยแล้ว');
  }

  clearAuth() {
    this.currentUser = null;
    this.isLoggedIn = false;
    this.isAdmin = false;
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('currentUser');
  }

  openAboutModal() { this.showAboutModal = true; }
  closeAboutModal() { this.showAboutModal = false; }

  openAddForm() {
    this.isEditing = false;
    this.editingId = null;
    this.productForm = {
      name: '', 
      price: null,  
      stock: null,  
      category: 'อาหาร', 
      zone: 'อ่าวไทย', 
      province: '',
      description: '', 
      producerName: '', 
      phone: '', 
      imageUrl: '',
      isFeatured: false, 
      isLatest: true
    };
    this.showFormModal = true;
  }

  openEditForm(product: Product) {
    this.isEditing = true;
    this.editingId = product.id;
    this.productForm = { ...product }; 
    this.showFormModal = true;
  }

  closeForm() {
    this.showFormModal = false;
  }

  // ==============================================================
  // 📸 ฟังก์ชันอัปโหลดรูปภาพผ่าน Cloudinary
  // ==============================================================
  isDragging: boolean = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.uploadFile(file);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  uploadFile(file: File) {
    this.isUploading = true;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); 
    
    const url = `https://api.cloudinary.com/v1_1/acnzxyvd/image/upload`; 

    this.http.post(url, formData).subscribe({
      next: (response: any) => {
        this.productForm.imageUrl = response.secure_url; 
        this.isUploading = false;
      },
      error: (err) => {
        console.error('Upload Error:', err);
        this.isUploading = false;
        alert('❌ เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
      }
    });
  }

  removeImage(event: Event) {
    event.preventDefault(); 
    event.stopPropagation(); 
    this.productForm.imageUrl = '';
  }

  saveProduct() {
    if (!this.productForm.name || !this.productForm.province) {
      alert('⚠️ กรุณากรอกชื่อสินค้าและจังหวัดให้ครบถ้วน');
      return;
    }

    if (!this.productForm.price || Number(this.productForm.price) <= 0) {
      alert('⚠️ กรุณาระบุราคาสินค้าให้ถูกต้อง (ต้องมากกว่า 0)');
      return;
    }

    if (this.productForm.stock === null || this.productForm.stock === undefined || Number(this.productForm.stock) < 0) {
      alert('⚠️ กรุณาระบุจำนวนสินค้าให้ถูกต้อง (ห้ามติดลบ)');
      return;
    }

    const { id, ...restForm } = this.productForm;
    
    const payload = {
      ...restForm,
      price: Number(this.productForm.price),
      stock: Number(this.productForm.stock)
    };

    if (this.isEditing && this.editingId) {
      this.productService.updateProduct(this.editingId, payload).subscribe({
        next: () => {
          alert('✅ อัปเดตข้อมูลสำเร็จ');
          this.loadProducts();
          this.closeForm();
        },
        error: (err) => this.handleError(err)
      });
    } else {
      this.productService.addProduct(payload).subscribe({
        next: () => {
          alert('✅ เพิ่มสินค้าใหม่สำเร็จ');
          this.loadProducts();
          this.closeForm();
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  deleteProduct(id: number) {
    if (confirm('⚠️ แน่ใจหรือไม่ว่าต้องการลบสินค้านี้ออกจากฐานข้อมูลจริง?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
          alert('✅ ลบสินค้าเรียบร้อย');
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  handleError(err: any) {
    if (err.status === 401 || err.status === 403) {
      alert('❌ สิทธิ์เข้าถึงหมดอายุหรือไม่เพียงพอ กรุณาเข้าสู่ระบบด้วยบัญชีแอดมิน');
      this.logout();
    } else {
      alert('❌ เกิดข้อผิดพลาดจากระบบหลังบ้าน');
      console.error(err);
    }
  }

  get filteredProducts(): Product[] {
    return this.products.filter(product => {
      const matchCategory = this.selectedCategory === 'ทั้งหมด' || product.category === this.selectedCategory;
      const matchZone = this.selectedZone === 'ทั้งหมด' || product.zone === this.selectedZone;
      const safeName = product.name || '';
      const safeProducer = product.producerName || '';
      
      const matchSearch = safeName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          safeProducer.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchCategory && matchZone && matchSearch;
    });
  }

  selectCategory(category: string) { this.selectedCategory = category; }
  selectZone(zone: string) { this.selectedZone = zone; }
  openModal(product: Product) { this.selectedProduct = product; }
  closeModal() { this.selectedProduct = null; }
  resetFilters() { this.selectedCategory = 'ทั้งหมด'; this.selectedZone = 'ทั้งหมด'; this.searchTerm = ''; }
}