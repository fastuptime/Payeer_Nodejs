# Payeer Ödeme Geçidi Entegrasyonu 🚀

Bu proje, Node.js kullanarak Payeer ödeme geçidi entegrasyonunu basit bir şekilde nasıl yapacağınızı gösterir. Ödeme formları oluşturabilir ve gelen ödeme durumlarını doğrulayabilirsiniz. 🛡️

## Özellikler ✨

- 💳 Güvenli ödeme formları oluşturma
- ✅ Ödeme durum bildirimlerini doğrulama
- ⚡ Basit Express.js sunucu kurulumu

## Gereksinimler 📋

1. Node.js kurulu olmalı.
2. Bir Payeer satıcı hesabı.

## Kurulum 🛠️

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/fastuptime/Payeer_Nodejs.git
   cd Payeer_Nodejs
   ```

2. Gerekli bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Payeer kimlik bilgilerinizi güncelleyin:
   - `XXXXXX` yerine `m_shop` kimliğinizi yazın.
   - `XXXXXXXX` yerine `m_key` değerini yazın.

## Kullanım 🚀

### Sunucuyu Başlatma

Sunucuyu çalıştırmak için:
```bash
node payeer.js
```
Sunucu `80` portunda çalışır durumda olacaktır.

### API Uç Noktaları 🌐

#### 1. `GET /`
Payeer üzerinden ödeme başlatmak için bir ödeme formu oluşturur.

**Dönüş Değeri:**
```json
{
  "form": "<html form içeriği>"
}
```

#### 2. `POST /status`
Payeer tarafından gönderilen ödeme durumunu işler ve doğrular.

**İstek Gövdesi:**
```json
{
  "m_operation_id": "...",
  "m_operation_ps": "...",
  "m_operation_date": "...",
  "m_operation_pay_date": "...",
  "m_shop": "...",
  "m_orderid": "...",
  "m_amount": "...",
  "m_curr": "...",
  "m_desc": "...",
  "m_status": "success",
  "m_sign": "..."
}
```

**Dönüş Değeri:**
- Geçerli ödemelerde: `<orderid>|success`
- Geçersiz ödemelerde: `<orderid>|error`

#### 3. `GET /payeer_2175693165.txt`
Payeer doğrulama dosyasını döner.

**Dönüş Değeri:**
```
2175693165
```

## Kod Detayları 🔍

### `Payeer` Sınıfı

Bu sınıf, ödeme formu oluşturma ve ödeme durum doğrulama işlevlerini yönetir.

#### Metotlar:
- `generatePayment(m_orderid, m_amount, m_curr, m_desc)`: Güvenli bir imzayla ödeme formu oluşturur.
- `validatePaymentStatus(paymentData)`: Gelen ödeme durum bildirimini doğrular.
- `generateSignature(...)`: SHA-256 imzası oluşturur.
- `generatePaymentStatusSignature(paymentData)`: Ödeme durumu doğrulama için imza oluşturur.

### Express.js Sunucusu

Sunucu şu işlevleri sunar:
- Ödeme formu oluşturma
- Ödeme durum doğrulama
- Gerekli Payeer doğrulama dosyasını sunma

## Notlar 📝

- Yer tutucuları (ör. `XXXXXX`) gerçek Payeer kimlik bilgilerinizle değiştirin.
- Sunucunuzun Payeer'den ödeme bildirimlerini alabilmesi için herkese açık erişilebilir olduğundan emin olun.

## Lisans 📄

Bu proje MIT Lisansı ile lisanslanmıştır. Ayrıntılar için [LICENSE](LICENSE) dosyasına bakabilirsiniz. 🖋️
