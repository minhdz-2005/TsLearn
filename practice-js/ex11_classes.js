// =====================================================================
// BÀI 11 — Class: kế thừa, getter/setter, static, private field
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. Class + constructor + phương thức.
//   2. Kế thừa bằng extends + super().
//   3. getter / setter tính giá trị dẫn xuất.
//   4. static (thuộc về class, không thuộc instance) & private field (#ten).
//   5. Override phương thức và gọi lại phương thức cha.
//   6. instanceof và phương thức kế thừa từ Object.prototype.
//
// CÁCH CHẠY:  node practice-js/ex11_classes.js
// =====================================================================

class Hinh {
  #loai = "hinh"; // private field (không truy cập được từ ngoài)
  constructor(ten) {
    this.ten = ten;
  }
  get tenLoai() {
    // getter
    return this.#loai;
  }
  set moTa(giaTri) {
    // setter
    this._moTa = `<<${giaTri}>>`;
  }
  get moTa() {
    return this._moTa;
  }
  tinhDienTich() {
    throw new Error("Chưa implement");
  }
  static soSanh(a, b) {
    // static method: gọi trên class
    return a.tinhDienTich() - b.tinhDienTich();
  }
  moTaNgan() {
    return `${this.ten}: ${this.tinhDienTich().toFixed(2)}`;
  }
}

class HinhChuNhat extends Hinh {
  constructor(dai, rong) {
    super("Hinh chu nhat"); // gọi constructor của class cha
    this.dai = dai;
    this.rong = rong;
  }
  tinhDienTich() {
    return this.dai * this.rong;
  }
  // Override nhưng vẫn dùng logic của cha
  moTaNgan() {
    return `${super.moTaNgan()} (dai=${this.dai}, rong=${this.rong})`;
  }
}

class HinhVuong extends HinhChuNhat {
  constructor(canh) {
    super(canh, canh);
    this.ten = "Hinh vuong";
  }
}

class HinhTron extends Hinh {
  #banKinh;
  constructor(banKinh) {
    super("Hinh tron");
    this.#banKinh = banKinh; // private
  }
  get banKinh() {
    return this.#banKinh;
  }
  set banKinh(giaTri) {
    if (giaTri <= 0) throw new Error("Ban kinh phai > 0");
    this.#banKinh = giaTri;
  }
  tinhDienTich() {
    return Math.PI * this.#banKinh ** 2;
  }
}

console.log("--- instance ---");
const chuNhat = new HinhChuNhat(4, 5);
const vuong = new HinhVuong(3);
const tron = new HinhTron(2);
console.log(chuNhat.moTaNgan());
console.log(vuong.moTaNgan());
console.log(tron.moTaNgan());

console.log("--- getter/setter ---");
tron.banKinh = 3;
console.log("bán kính mới:", tron.banKinh, "| diện tích:", tron.tinhDienTich().toFixed(2));
try {
  tron.banKinh = -1;
} catch (e) {
  console.log("bắt lỗi setter:", e.message);
}
tron.moTa = "tron trong"; // dùng setter của class cha
console.log("moTa:", tron.moTa);

console.log("--- private ---");
console.log("truong #loai truy cập ngoài -> undefined:", chuNhat.loai);

console.log("--- static & instanceof ---");
console.log("static soSanh:", Hinh.soSanh(tron, chuNhat).toFixed(2));
console.log("vuong instanceof Hinh:", vuong instanceof Hinh);
console.log("vuong instanceof HinhChuNhat:", vuong instanceof HinhChuNhat);
console.log("tron instanceof HinhChuNhat:", tron instanceof HinhChuNhat);
console.log("typeof class:", typeof Hinh, "| ten class:", Hinh.name);

// Bài tập tự làm
// 1) Viết class NganHang với #soDu, gui(rut), laySoDu(), chặn rút quá số dư.
// 2) Viết class Diem(x, y) có getter khoangCacheGoc và static tyLe(a, b).
// 3) Tạo MStack extends Array ghi đè push để giữ tối đa 3 phần tử.
