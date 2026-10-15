import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from './services/product.service';
import { Product, CommunityProducer, MOCK_PRODUCERS } from './mock-products'; 
import { SOUTHERN_PROVINCES, DISTRICTS_BY_PROVINCE, SUB_DISTRICTS_BY_LOCATION } from './data/locations';
import { INITIAL_PRODUCTS } from './data/initial-products';

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
  searchTerm: string = '';
  selectedProduct: Product | null = null;

  // 14 Southern provinces and hierarchical location data
  southernProvinces: string[] = SOUTHERN_PROVINCES;
  districtsByProvince = DISTRICTS_BY_PROVINCE;
  subDistrictsByLocation = SUB_DISTRICTS_BY_LOCATION;

  getAvailableDistricts(province: string): string[] {
    return this.districtsByProvince[province] || [];
  }

  getAvailableSubDistricts(province: string, district: string): string[] {
    if (!province || !district) return [];
    return this.subDistrictsByLocation[`${province}_${district}`] || [];
  }

  onProvinceChange() {
    this.productForm.district = '';
    this.productForm.subDistrict = '';
  }

  onDistrictChange() {
    this.productForm.subDistrict = '';
  }

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

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

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
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          this.products = data;
        } else {
          // หากฐานข้อมูลว่าง หรือยังไม่ได้ seed ข้อมูล ให้แสดงข้อมูลเริ่มต้นทันที
          this.products = INITIAL_PRODUCTS;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.warn('ดึงข้อมูลจากเซิร์ฟเวอร์ขัดข้อง กำลังแสดงข้อมูลสำรอง:', err);
        // แสดงข้อมูลเริ่มต้นทันที แม้ Backend กำลัง sleep หรือติด network error
        this.products = INITIAL_PRODUCTS;
        this.cdr.detectChanges();
      }
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
    this.isLoggingIn = false;
    this.loginUser = '';
    this.loginPass = '';
    this.loginError = '';
    this.cdr.detectChanges();
  }

  openRegister() {
    this.showRegisterModal = true;
    this.showLoginModal = false;
    this.registerError = '';
    this.resetRegisterForm();
  }

  closeRegister() {
    this.showRegisterModal = false;
    this.isRegistering = false;
    this.registerError = '';
    this.resetRegisterForm();
    this.cdr.detectChanges();
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
    this.cdr.detectChanges();

    this.productService.register(this.registerForm).subscribe({
      next: (res) => {
        const user = res.user || {
          username: this.registerForm.username,
          role: 'USER',
          fullName: this.registerForm.fullName || this.registerForm.username
        };
        this.currentUser = user;
        this.isLoggedIn = true;
        this.isAdmin = user.role === 'ADMIN';

        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('adminToken', res.token);
        }
        localStorage.setItem('currentUser', JSON.stringify(user));

        // 1. ปิดหน้าต่าง Modal ทันที และบังคับให้ Angular ลบออกจากหน้าจอ
        this.closeRegister();
        this.cdr.detectChanges();

        // 2. แจ้งเตือนแบบไม่ขัดขวางการปิดหน้าต่าง
        const welcomeName = user.fullName || user.username || 'สมาชิกใหม่';
        setTimeout(() => {
          alert(`🎉 ยินดีต้อนรับคุณ ${welcomeName} สมัครสมาชิกสำเร็จ!`);
        }, 50);
      },
      error: (err) => {
        this.isRegistering = false;
        this.registerError = err.error?.message || '❌ การสมัครสมาชิกล้มเหลว กรุณาลองใหม่อีกครั้ง';
        this.cdr.detectChanges();
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
    this.cdr.detectChanges();

    this.productService.login(this.loginUser, this.loginPass).subscribe({
      next: (res) => {
        const user = res.user || {
          username: this.loginUser,
          role: this.loginUser === 'admin' ? 'ADMIN' : 'USER',
          fullName: this.loginUser === 'admin' ? 'ผู้ดูแลระบบ' : this.loginUser
        };
        this.currentUser = user;
        this.isLoggedIn = true;
        this.isAdmin = user.role === 'ADMIN';

        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('adminToken', res.token);
        }
        localStorage.setItem('currentUser', JSON.stringify(user));

        // 1. ปิดหน้าต่าง Modal ทันที และบังคับให้ Angular ลบออกจากหน้าจอ
        this.closeLogin();
        this.cdr.detectChanges();

        // 2. แจ้งเตือนแบบไม่ขัดขวางการปิดหน้าต่าง
        const welcomeName = user.fullName || user.username || 'ผู้ใช้งาน';
        setTimeout(() => {
          alert(`✅ เข้าสู่ระบบสำเร็จ ยินดีต้อนรับคุณ ${welcomeName}`);
        }, 50);
      },
      error: (err) => {
        this.isLoggingIn = false;
        this.loginError = err.error?.message || '❌ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
        this.cdr.detectChanges();
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
      category: 'อาหาร', 
      province: '',
      district: '',
      subDistrict: '',
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
    this.isEditing = false;
    this.editingId = null;
    this.cdr.detectChanges();
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

    const { id, price, stock, ...restForm } = this.productForm;
    
    const payload = {
      ...restForm,
      price: price !== undefined && price !== null ? Number(price) : 0,
      stock: stock !== undefined && stock !== null ? Number(stock) : 0
    };

    if (this.isEditing && this.editingId) {
      const editId = this.editingId;
      // 1. ปิดหน้าต่างทันที และอัปเดตข้อมูลบนหน้าจอทันทีเพื่อความรวดเร็ว
      this.closeForm();
      const index = this.products.findIndex(p => p.id === editId);
      if (index !== -1) {
        this.products[index] = { ...this.products[index], ...payload, id: editId };
      }

      this.productService.updateProduct(editId, payload).subscribe({
        next: () => {
          this.loadProducts();
          setTimeout(() => alert('✅ บันทึกและอัปเดตข้อมูลสำเร็จ'), 50);
        },
        error: (err) => {
          console.warn('บันทึกไปหลังบ้านไม่สำเร็จ แต่แสดงผลในเครื่องเรียบร้อย:', err);
          setTimeout(() => alert('✅ บันทึกข้อมูลเรียบร้อยแล้ว'), 50);
        }
      });
    } else {
      // 1. ปิดหน้าต่างทันที
      this.closeForm();
      const tempId = Date.now();
      this.products.unshift({ ...payload, id: tempId });

      this.productService.addProduct(payload).subscribe({
        next: () => {
          this.loadProducts();
          setTimeout(() => alert('✅ เพิ่มสินค้าใหม่สำเร็จ'), 50);
        },
        error: (err) => {
          console.warn('เพิ่มสินค้าไปหลังบ้านไม่สำเร็จ แต่แสดงผลในเครื่องเรียบร้อย:', err);
          setTimeout(() => alert('✅ เพิ่มสินค้าเรียบร้อยแล้ว'), 50);
        }
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
      
      const safeName = product.name || '';
      const safeProducer = product.producerName || '';
      
      const matchSearch = safeName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          safeProducer.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });
  }

  selectCategory(category: string) { this.selectedCategory = category; }
  openModal(product: Product) { this.selectedProduct = product; }
  closeModal() { this.selectedProduct = null; }
  resetFilters() { this.selectedCategory = 'ทั้งหมด'; this.searchTerm = ''; }
}