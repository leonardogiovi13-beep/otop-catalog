const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('กำลังล้างข้อมูลเก่า...');
  // ลบข้อมูลเก่าทิ้งทั้งหมด เพื่อไม่ให้ข้อมูลซ้ำซ้อน
  await prisma.product.deleteMany({});

  const products = [
    {
      id: 1,
      name: 'กล้วยเล็บมือนางอบ',
      category: 'อาหาร',
      zone: 'อ่าวไทย',
      province: 'ชุมพร',
      description: 'กล้วยเล็บมือนางอบธรรมชาติ หวานนุ่ม ละมุนลิ้น ของดีประจำจังหวัดชุมพร',
      producerName: 'วิสาหกิจชุมชนแปรรูปกล้วยเล็บมือนางชุมพร',
      imageUrl: 'https://www.ตลาดเกษตรกรออนไลน์.com/uploads/products/cover_650647ea6c06a.jpg',
      phone: '077-123-456',
      isFeatured: true
    },
    {
      id: 2,
      name: 'กาแฟเขาทะลุ',
      category: 'เครื่องดื่ม',
      zone: 'อ่าวไทย',
      province: 'ชุมพร',
      description: 'กาแฟโรบัสต้าแท้ 100% หอม เข้มข้น ปลูกในพื้นที่เขาทะลุอันอุดมสมบูรณ์',
      producerName: 'กลุ่มเกษตรกรทำสวนเขาทะลุ',
      imageUrl: 'https://files.agrinewsthai.com/2024/10/425834770_356169807236065_3007699612950848339_n.jpg',
      phone: '077-234-567',
      isLatest: true
    },
    {
      id: 3,
      name: 'ผลิตภัณฑ์รังนก',
      category: 'อาหาร',
      zone: 'อ่าวไทย',
      province: 'ชุมพร',
      description: 'รังนกแท้คุณภาพสูงจากเกาะธรรมชาติ แปรรูปสะอาด ถูกสุขอนามัย',
      producerName: 'กลุ่มรังนกแท้เมืองชุมพร',
      imageUrl: 'https://www.รังนกแท้.com/sites/storage/files/users/e/b/3/d/eb3de4af-6a59-4974-8f05-052fe156fa56/6a6c0888a860f-%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%94%E0%B8%B7%E0%B9%88%E0%B8%A1%E0%B8%A3%E0%B8%B1%E0%B8%87%E0%B8%99%E0%B8%81%E0%B8%82%E0%B8%99%E0%B8%B2%E0%B8%94-70CC-%E0%B8%8A%E0%B8%B8%E0%B8%94%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%8A%E0%B9%89%E0%B8%B2.png?itok=6ac4ff1a55682',
      phone: '077-345-678'
    },
    {
      id: 4,
      name: 'กะปิโหว่',
      category: 'อาหาร',
      zone: 'อ่าวไทย',
      province: 'ชุมพร',
      description: 'กะปิโหว่สูตรโบราณ รสชาติกลมกล่อม ทานคู่กับผลไม้รสเปรี้ยวได้อย่างลงตัว',
      producerName: 'กลุ่มแม่บ้านแปรรูปอาหารทะเลชุมพร',
      imageUrl: 'https://www.otoptoday.com/images/upload_img/products/product_cover_1681891189.jpg',
      phone: '081-987-6543'
    },
    {
      id: 5,
      name: 'ไข่เค็มไชยา',
      category: 'อาหาร',
      zone: 'อ่าวไทย',
      province: 'สุราษฎร์ธานี',
      description: 'ไข่เค็มพอกดินสอพองผสมใบเตย ไข่แดงมันวาว รสกลมกล่อมไม่เค็มจัด',
      producerName: 'วิสาหกิจชุมชนไข่เค็มไชยา',
      imageUrl: 'https://www.agrinewsthai.com/wp-content/uploads/2024/09/%E0%B9%84%E0%B8%82%E0%B9%88%E0%B9%80%E0%B8%84%E0%B9%87%E0%B8%A12.jpg.webp',
      phone: '077-888-999',
      isFeatured: true
    },
    {
      id: 6,
      name: 'ผ้าไหมพุมเรียง',
      category: 'ผ้าและเครื่องแต่งกาย',
      zone: 'อ่าวไทย',
      province: 'สุราษฎร์ธานี',
      description: 'ผ้าไหมยกดิ้นทอมือ ลวดลายโบราณ เอกลักษณ์หัตถกรรมแห่งตำบลพุมเรียง',
      producerName: 'กลุ่มทอผ้าไหมพุมเรียง',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS02bOD4M_8nRjrTZ9llBPdgMnC-LYuOM8q20ud8pe6Y8U4alzK88GOIZg&s=10',
      phone: '077-444-555'
    },
    {
      id: 7,
      name: 'กะละแม',
      category: 'อาหาร',
      zone: 'อ่าวไทย',
      province: 'สุราษฎร์ธานี',
      description: 'กะละแมเกาะสมุย เหนียวนุ่ม หวานมัน หอมกลิ่นใบเตยและกาแฟสด',
      producerName: 'กลุ่มกะละแมโบราณเกาะสมุย',
      imageUrl: 'https://www.otoptoday.com/images/upload_img/products/product_cover_1593001993.jpg',
      phone: '089-123-4567'
    },
    {
      id: 8,
      name: 'น้ำมันมะพร้าวสกัดเย็น',
      category: 'สมุนไพร/ของใช้',
      zone: 'อ่าวไทย',
      province: 'สุราษฎร์ธานี',
      description: 'น้ำมันมะพร้าวบริสุทธิ์ 100% สกัดเย็น บำรุงผิวพรรณและเส้นผม',
      producerName: 'วิสาหกิจชุมชนแปรรูปมะพร้าวสุราษฎร์',
      imageUrl: 'https://www.ตลาดเกษตรกรออนไลน์.com/uploads/products/cover_60cffda59d357.jpg',
      phone: '084-555-4321',
      isLatest: true
    },
    {
      id: 9,
      name: 'ส้มโอทับทิมสยามปากพนัง',
      category: 'อาหาร',
      zone: 'อ่าวไทย',
      province: 'นครศรีธรรมราช',
      description: 'ส้มโอเนื้อสีแดงทับทิม หวานฉ่ำ นุ่มนวล สินค้า GI ขึ้นชื่อเมืองนคร',
      producerName: 'กลุ่มวิสาหกิจชุมชนส้มโอทับทิมสยามปากพนัง',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT39addS6D82BCdr5C2uR0_SVAGbbM4gpolBlg6mm0DuKbme519DKl6kPBo&s=10',
      phone: '082-999-8877',
      isFeatured: true
    },
    {
      id: 10,
      name: 'ขนมลา',
      category: 'อาหาร',
      zone: 'อ่าวไทย',
      province: 'นครศรีธรรมราช',
      description: 'ขนมพื้นบ้านดั้งเดิม เส้นใยบางเบา หอมหวานน้ำผึ้งรวงและน้ำตาลตโนด',
      producerName: 'กลุ่มแม่บ้านขนมลาปากพนัง',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBhYiUDRo1-zV12Fp9XmbwcOgYdxa8LwrWknhdH-A1i68_Z7QOstHvPEfW&s=10',
      phone: '075-111-222'
    },
    {
      id: 11,
      name: 'เครื่องถมนคร',
      category: 'ของประดับตกแต่ง',
      zone: 'อ่าวไทย',
      province: 'นครศรีธรรมราช',
      description: 'หัตถกรรมเครื่องเงินถมทองชั้นสูง ลวดลายประณีต วิจิตรงดงามตามตำรับโบราณ',
      producerName: 'กลุ่มหัตถกรรมเครื่องถมเมืองนคร',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBFs4BGx3q26iv0HPD6xeuvY7sTcV1Y6gXhFRVB9ph8iP_zVzhGnRya4o&s=10w',
      phone: '075-345-678',
      isFeatured: true
    },
    {
      id: 12,
      name: 'งานจักสานย่านลิเภา',
      category: 'ของใช้',
      zone: 'อ่าวไทย',
      province: 'นครศรีธรรมราช',
      description: 'กระเป๋าและเครื่องใช้สานจากย่านลิเภา ละเมียดละไม แข็งแรง ทรงคุณค่า',
      producerName: 'กลุ่มจักสานย่านลิเภาบ้านท่าเรือ',
      imageUrl: 'https://culture55520089.wordpress.com/wp-content/uploads/2015/03/k.jpg?',
      phone: '086-111-2233'
    },
    {
      id: 13,
      name: 'ผ้ามัดย้อมสีธรรมชาติ',
      category: 'ผ้าและเครื่องแต่งกาย',
      zone: 'อ่าวไทย',
      province: 'นครศรีธรรมราช',
      description: 'ผ้ามัดย้อมสกัดจากคีรีวง ย้อมสีธรรมชาติตามวิถีชุมชนเทือกเขาหลวง',
      producerName: 'กลุ่มผ้ามัดย้อมสีธรรมชาติคีรีวง',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLSKa9iqYdc9VL1bf5PuJtghAnAHmao-WOZg53EExCjQ&s=10',
      phone: '081-333-4444',
      isLatest: true
    },
    {
      id: 14,
      name: 'ผลิตภัณฑ์สปาโคลน',
      category: 'สมุนไพร/ของใช้',
      zone: 'อ่าวไทย',
      province: 'นครศรีธรรมราช',
      description: 'สปาโคลนธรรมชาติบำรุงผิวพรรณ ดูดซับสิ่งสกปรก คืนความชุ่มชื้น',
      producerName: 'วิสาหกิจชุมชนสปาโคลนบ้านแหลม',
      imageUrl: 'https://baanlaemhomestay.com//pic/cover/s15.jpg',
      phone: '089-777-6655'
    },
    {
      id: 15,
      name: 'มังคุดคัด',
      category: 'อาหาร',
      zone: 'อ่าวไทย',
      province: 'นครศรีธรรมราช',
      description: 'มังคุดดิบเสียบไม้ กรอบ อร่อย หวานอมเปรี้ยว ของกินเล่นระดับตำนานเมืองนคร',
      producerName: 'กลุ่มผู้ผลิตมังคุดคัดเมืองนคร',
      imageUrl: 'https://library.wu.ac.th/nst_localinfo/wp-content/uploads/sites/11/2022/12/DSC07887-scaled-e1671430840824.jpg',
      phone: '081-222-3333'
    },
    {
      id: 16,
      name: 'ข้าวสังข์หยด',
      category: 'อาหาร',
      zone: 'อ่าวไทย',
      province: 'พัทลุง',
      description: 'ข้าวพันธุ์พื้นเมืองพัทลุง คุณประโยชน์สูง คุณค่าทางโภชนาการแน่นแก้ว',
      producerName: 'วิสาหกิจชุมชนข้าวสังข์หยดพัทลุง',
      imageUrl: 'https://www.ตลาดเกษตรกรออนไลน์.com/uploads/products/cover_63d9eb78ea49d.jpg',
      phone: '074-611-223',
      isLatest: true
    },
    {
      id: 17,
      name: 'งานจักสานกระจูด',
      category: 'ของใช้',
      zone: 'อ่าวไทย',
      province: 'พัทลุง',
      description: 'กระเป๋าและของใช้สานจากต้นกระจูด ดีไซน์มินิมอล ทันสมัย ร่วมสมัย',
      producerName: 'กลุ่มหัตถกรรมกระจูดทะเลน้อย',
      imageUrl: 'https://wegophatthalung.com/wp-content/uploads/2019/07/Content_Krajood_4.jpg',
      phone: '074-622-334'
    },
    {
      id: 18,
      name: 'กาละแม แม่ทิม',
      category: 'อาหาร',
      zone: 'อ่าวไทย',
      province: 'พัทลุง',
      description: 'กาละแมกวนสดสูตรดั้งเดิม หวานกำลังดี หอมกะทิสดธรรมชาติ',
      producerName: 'กลุ่มแม่บ้านเกษตรกรกาละแมแม่ทิม',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9ArhB6hY9zRO63yd9OkoCISpmjmIUkiJWsgwxmHuYKML9i9Iu26z-3Eqk&s=10',
      phone: '081-555-6677'
    },
    {
      id: 19,
      name: 'กล้วยเมืองลุงทอดกรอบ',
      category: 'อาหาร',
      zone: 'อ่าวไทย',
      province: 'พัทลุง',
      description: 'กล้วยหินทอดกรอบ รสชาติกลมกล่อม กรุบกรอบ ไม่อมน้ำมัน',
      producerName: 'กลุ่มแปรรูปกล้วยเมืองลุง',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXDO899pMl_USDv-Aro-APSptLOQlq2dheDEaotVyYbkB3ywFsxg8eYff4&s=10',
      phone: '083-444-5566'
    },
    {
      id: 20,
      name: 'ผ้าทอเกาะยอ',
      category: 'ผ้าและเครื่องแต่งกาย',
      zone: 'อ่าวไทย',
      province: 'สงขลา',
      description: 'ผ้าทอมือลายราชวัตร ลวดลายเป็นเอกลักษณ์เฉพาะของเกาะยอ สงขลา',
      producerName: 'กลุ่มราชวัตรผ้าทอเกาะยอ',
      imageUrl: 'https://www.hatyaifocus.com/ckeditor/upload/userfilesfile/1AAAJADE/%E0%B8%9C%E0%B9%89%E0%B8%B2%E0%B9%80%E0%B8%81%E0%B8%B2%E0%B8%B0%E0%B8%A2%E0%B8%AD/2.jpg',
      phone: '074-331-122',
      isFeatured: true
    },
    {
      id: 21,
      name: 'น้ำตาลแว่น',
      category: 'อาหาร',
      zone: 'อ่าวไทย',
      province: 'สงขลา',
      description: 'น้ำตาลโหนดแท้ 100% หอมหวานธรรมชาติ ปราศจากสารเคมีเจือปน',
      producerName: 'กลุ่มทำน้ำตาลโหนดสทิงพระ',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzQxXT_yrBajLYTNkBA2PjKkbK1p5BZDaB9b2c_RaNuQ&s=10',
      phone: '074-332-233'
    },
    {
      id: 22,
      name: 'กะปิเทพา',
      category: 'อาหาร',
      zone: 'อ่าวไทย',
      province: 'สงขลา',
      description: 'กะปิแท้ทำจากเคยแก้วเกรด A หอม รสชาติดี ปราศจากวัตถุกันเสีย',
      producerName: 'กลุ่มแปรรูปอาหารทะเลอำเภอเทพา',
      imageUrl: 'https://scontent-bkk1-2.xx.fbcdn.net/v/t39.30808-6/479858731_1298837111355191_2768811907887617951_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx2048x1536&ctp=s2048x1536&_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEJ7-UZsyT3CmJRLnJu3AldDDG1WY0ri6gMMbVZjSuLqAynivM2T9ttIXpkbQpn1hlJI95Dto07XqjLSviB0njL&_nc_ohc=Z9vw9zKQCzwQ7kNvwH1e5jl&_nc_oc=Adr5HRr-FC3JRJBbwNco6CJjtx5yIcWszjEm6ZHzrTH1JbiLYArGy2EbJKzZVlV-5DE&_nc_zt=23&_nc_ht=scontent-bkk1-2.xx&_nc_gid=TM_6L898-7ShT6DdEcS25g&_nc_ss=7b2a8&oh=00_AQP2vP9SdURPJQzQugDhD6g1QWssnYxqo5PjaX3DTlNQEg&oe=6ACB08C1',
      phone: '081-777-8899'
    },
    // --- ฝั่งอันดามัน ---
    {
      id: 23,
      name: 'ซาลาเปาทับหลี',
      category: 'อาหาร',
      zone: 'อันดามัน',
      province: 'ระนอง',
      description: 'ซาลาเปานุ่ม แป้งบาง ไส้แน่นสูตรตำนานทับหลี เมืองระนอง',
      producerName: 'กลุ่มแปรรูปซาลาเปาทับหลี',
      imageUrl: 'https://img.wongnai.com/p/1920x0/2023/02/15/186bc6a4c8c646f48b656aec81d5e360.jpg',
      phone: '077-811-222'
    },
    {
      id: 24,
      name: 'เม็ดมะม่วงหิมพานต์',
      category: 'อาหาร',
      zone: 'อันดามัน',
      province: 'ระนอง',
      description: 'กาหยูหรือเม็ดมะม่วงหิมพานต์เผาโบราณ หอม มัน กรอบ ทานเพลิน',
      producerName: 'กลุ่มกาหยูระนองอบกรอบ',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5uMtujK41sqBVcNRH3Ee9vWFf76PfP_vhX7-UiTHqKQ_YwdInH3xU2R4&s=10',
      phone: '077-822-333'
    },
    {
      id: 25,
      name: 'ขนมเต้าส้อ',
      category: 'อาหาร',
      zone: 'อันดามัน',
      province: 'พังงา',
      description: 'ขนมเต้าส้อไส้เค็มและไส้หวาน กรอบนอกนุ่มใน สูตรดั้งเดิมเมืองตะกั่วป่า',
      producerName: 'กลุ่มขนมพื้นเมืองตะกั่วป่า',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEDZxLqYnN8vlWN_aCgUQD7RoQ-QlH-B0Ev98w1J2nCgKtq5RG0d8wXqo&s=10',
      phone: '076-411-555'
    },
    {
      id: 26,
      name: 'เครื่องประดับมุก',
      category: 'ของประดับตกแต่ง',
      zone: 'อันดามัน',
      province: 'พังงา',
      description: 'เครื่องประดับมุกแท้จากฟาร์มอันดามัน เงางาม ดีไซน์หรูหราทรงคุณค่า',
      producerName: 'กลุ่มหัตกรรมมุกอันดามันพังงา',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSvIoQ3hSfQMhkZFyc6KtJ50T3zlM0U_2MEZhvUCLBYFoHGU9-frlfOgk&s=10',
      phone: '076-422-666',
      isLatest: true
    },
    {
      id: 27,
      name: 'น้ำพริกกุ้งเสียบ',
      category: 'อาหาร',
      zone: 'อันดามัน',
      province: 'ภูเก็ต',
      description: 'น้ำพริกกุ้งเสียบรมควัน ตำสด รสเผ็ดจัดจ้านสไตล์เมืองภูเก็ต',
      producerName: 'กลุ่มผลิตภัณฑ์น้ำพริกกุ้งเสียบภูเก็ต',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSijf245OAV0W5dM9BI0sUJ7uJzUso_dHCLGL-iHsRX7wdONer_gM84ExM&s=10',
      phone: '076-211-333'
    },
    {
      id: 28,
      name: 'ไข่มุกภูเก็ต',
      category: 'ของประดับตกแต่ง',
      zone: 'อันดามัน',
      province: 'ภูเก็ต',
      description: 'มุกเซาท์ซีและมุกเลี้ยงระดับพรีเมียม เล็กใหญ่คัดพิเศษจากทะเลภูเก็ต',
      producerName: 'กลุ่มวิสาหกิจมุกภูเก็ตแท้',
      imageUrl: 'https://www.phuketemagazine.com/wp-content/uploads/2017/05/pearl-cover-01-1024x683.png',
      phone: '076-355-777',
      isFeatured: true
    },
    {
      id: 29,
      name: 'คุกกี้เม็ดมะม่วงหิมพานต์',
      category: 'อาหาร',
      zone: 'อันดามัน',
      province: 'กระบี่',
      description: 'คุกกี้หอมเนยสด ผสมเม็ดมะม่วงหิมพานต์เคี้ยวเพลิน เหมาะเป็นของฝาก',
      producerName: 'กลุ่มเบเกอรี่ชุมชนกระบี่',
      imageUrl: 'https://candyandotopofsouth.wordpress.com/wp-content/uploads/2015/07/cookies04.jpg',
      phone: '075-612-345'
    },
    {
      id: 30,
      name: 'ขนมลากรอบ อบน้ำผึ้งโบราณ',
      category: 'อาหาร',
      zone: 'อันดามัน',
      province: 'กระบี่',
      description: 'ขนมลากรอบแผ่นบาง กรอบอร่อย เคลือบน้ำผึ้งรวงแท้',
      producerName: 'กลุ่มแม่บ้านขนมโบราณกระบี่',
      imageUrl: 'https://scontent-bkk1-2.xx.fbcdn.net/v/t39.30808-6/503756721_2731918390334557_5862669102212066561_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1536&ctp=s2048x1536&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGdL4PtTkyMmK5TAdigkay7Ey9vS3CP5pATL29LcI_mkL16oI8sfS8tR5HEUFS0Hhukx_iH19wWvTpV5B_YTzcy&_nc_ohc=wYG64iTXN5gQ7kNvwFfOIoM&_nc_oc=AdrEJZi6FHVvS3j-hGdybmsvsMe7R3RoLCGXqlhjlL5kMfIViMYB6Ql9le9w1Kv4zbk&_nc_zt=23&_nc_ht=scontent-bkk1-2.xx&_nc_gid=iXPpa2aV2JVq-ljl_A8TVQ&_nc_ss=7b2a8&oh=00_AQNaBNmIwptTw8W6NkGAX0Ue8Uf6PoxM3UMw0EMrxk9kqw&oe=6ACAE0A0',
      phone: '075-623-456'
    },
    {
      id: 31,
      name: 'หมูย่างเมืองตรัง',
      category: 'อาหาร',
      zone: 'อันดามัน',
      province: 'ตรัง',
      description: 'หมูย่างสูตรพิเศษ หนังกรอบ เนื้อนุ่ม หอมเครื่องเทศยาจีนแท้',
      producerName: 'กลุ่มผู้ประกอบการหมูย่างเมืองตรัง',
      imageUrl: 'https://api2.krua.co/wp-content/uploads/2021/11/Banner_1140x507-21.jpg',
      phone: '075-211-111',
      isFeatured: true
    },
    {
      id: 32,
      name: 'เค้กเมืองตรัง',
      category: 'อาหาร',
      zone: 'อันดามัน',
      province: 'ตรัง',
      description: 'เค้กมีรูตรงกลาง นุ่ม ฟู หอมกลิ่นเนยและใบเตย ต้นตำรับเมืองตรัง',
      producerName: 'กลุ่มเบเกอรี่เค้กตรังดั้งเดิม',
      imageUrl: 'https://scontent-bkk1-2.xx.fbcdn.net/v/t1.6435-9/65678275_1249306441895938_5963764301851262976_n.jpg?stp=dst-jpg_tt6&cstp=mx1264x1686&ctp=s1264x1686&_nc_cat=109&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeHXJYQTkUyrxpkahbrlCr1tIPn3TU7wB9Yg-fdNTvAH1qApBQUWqtH6xeAqvyTplyqVnl4_xz7W3wN0eY9ifv_w&_nc_ohc=5SQQGKUuQqEQ7kNvwHEAiXk&_nc_oc=Adry2xTmKyteESbjyR_dckeNGVEw2P8P3ajAeXjbEEoSF6zi2wsfVNkrn-O8H5bISTE&_nc_zt=23&_nc_ht=scontent-bkk1-2.xx&_nc_gid=j_mfcI4VEOU_03smEcLduA&_nc_ss=7b2a8&oh=00_AQNhbp3PXwnZLDFVRsK72b8rSs1PYS7SC0szJ6gFKGCCPg&oe=6AEC8B5F',
      phone: '075-222-222'
    },
    {
      id: 33,
      name: 'ผ้าทอนาหมื่นศรี',
      category: 'ผ้าและเครื่องแต่งกาย',
      zone: 'อันดามัน',
      province: 'ตรัง',
      description: 'ผ้าทอมือลายลูกแก้วและลายแก้วกัลยา ลวดลายหัตถกรรมเก่าแก่อายุกว่า 200 ปี',
      producerName: 'วิสาหกิจชุมชนผ้าทอนาหมื่นศรี',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU5QXd8KE985TEwJavmSORIaoPdr9SHcuBn3h8Eg5u9M5FYO3mR_Uwx8Nt&s=10',
      phone: '075-210-999',
      isLatest: true
    },
    {
      id: 34,
      name: 'กะปิกุ้งแท้เกาะลิบง',
      category: 'อาหาร',
      zone: 'อันดามัน',
      province: 'ตรัง',
      description: 'กะปิกุ้งเคยแท้จากธรรมชาติเกาะลิบง หอม สะอาด ปราศจากสีสังเคราะห์',
      producerName: 'กลุ่มประมงพื้นบ้านเกาะลิบง',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4A4-E3is79okM6175_itC9vcmlWRcOVyATqiOkxIaZL1SRc1WxB8giaY&s=10',
      phone: '081-444-3322'
    },
    {
      id: 35,
      name: 'ขนมบุหงาบุดะ',
      category: 'อาหาร',
      zone: 'อันดามัน',
      province: 'สตูล',
      description: 'ขนมพื้นเมืองทรงสี่เหลี่ยมคล้ายหมอน สอดไส้มะพร้าวผัดน้ำตาล หอมละมุน',
      producerName: 'กลุ่มขนมพื้นเมืองสตูล',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUpuLFLARmhWdsQ3NBNLAIXUn7m5Mbc3vJ0VBk1Bu_kJJZJj3SNe8JgOE&s=10',
      phone: '074-711-888'
    },
    {
      id: 36,
      name: 'ชาชัก',
      category: 'เครื่องดื่ม',
      zone: 'อันดามัน',
      province: 'สตูล',
      description: 'ชาชักเข้มข้น ฟองนุ่ม ฟองชาละมุนลิ้น ต้นตำรับชาใต้รสเด็ด',
      producerName: 'กลุ่มชาชักและโรตีเมืองสตูล',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8iLLKS-KS0QgWxyNMZbGIUTHuqWDdVyokgFTf0lIHqA2jNlDdfUq5xOLQ&s=10',
      phone: '074-722-999'
    },
    {
      id: 37,
      name: 'โรตีกรอบ',
      category: 'อาหาร',
      zone: 'อันดามัน',
      province: 'สตูล',
      description: 'โรตีกรอบแผ่นบาง นมเนยเน้นๆ กรอบอร่อยทานง่าย',
      producerName: 'กลุ่มแม่บ้านแปรรูปโรตีสตูล',
      imageUrl: 'https://img.lazcdn.com/g/p/d8748e0d0b078ebc2032cff68c8adf04.jpg_720x720q80.jpg',
      phone: '082-333-1122'
    },
    // --- ฝั่งชายแดนใต้ ---
    {
      id: 38,
      name: 'น้ำบูดู',
      category: 'อาหาร',
      zone: 'ชายแดนใต้',
      province: 'ปัตตานี',
      description: 'น้ำบูดูสายบุรีแท้ ปรุงรสกลมกล่อม หอม อร่อย สินค้าขึ้นชื่อจังหวัดปัตตานี',
      producerName: 'กลุ่มแปรรูปน้ำบูดูสายบุรี',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS1vNAUiFDZzIwGre0HNbpmik3sNT5LHPhzMtipWsip8ZbFueK5YkytjwT&s=10',
      phone: '073-331-444',
      isFeatured: true
    },
    {
      id: 39,
      name: 'เครื่องทองเหลือง',
      category: 'ของใช้',
      zone: 'ชายแดนใต้',
      province: 'ปัตตานี',
      description: 'ภาชนะและของใช้ทองเหลืองหล่อโบราณ ฝีมือประณีตทรงคุณค่า',
      producerName: 'กลุ่มหล่อทองเหลืองปัตตานี',
      imageUrl: 'https://clib.psu.ac.th/southerninfo/storages/pictures/wisdow%20(Folk%20tools)/Pattani/Screenshot%202024-09-04%20095726%20(2).png',
      phone: '073-342-555'
    },
    {
      id: 40,
      name: 'โรตีกรอบปัตตานี',
      category: 'อาหาร',
      zone: 'ชายแดนใต้',
      province: 'ปัตตานี',
      description: 'โรตีกรอบเคลือบน้ำตาลและนมสด ทานเพลินเป็นของฝากยอดนิยม',
      producerName: 'กลุ่มวิสาหกิจโรตีกรอบปัตตานี',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFShLYlq6qGrmKyabtVL3WLb9LY6V7GHSxYwydzukSioW7AUQ9l5waW6uD&s=10',
      phone: '089-666-5544'
    },
    {
      id: 41,
      name: 'กล้วยหินฉาบ',
      category: 'อาหาร',
      zone: 'ชายแดนใต้',
      province: 'ยะลา',
      description: 'กล้วยหินกวนและฉาบ กรอบมัน หวานกำลังดี วัตถุดิบเฉพาะถิ่นเบตงและบันนังสตา',
      producerName: 'กลุ่มแปรรูปกล้วยหินยะลา',
      imageUrl: 'https://scontent-bkk1-1.xx.fbcdn.net/v/t39.30808-6/310017723_462728489256488_4492384505357419690_n.jpg?stp=dst-jpg_tt6&cstp=mx960x960&ctp=s960x960&_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGURYvMdskbOOtaaSJvozhaSRt4l3LHnjBJG3iXcseeMCNgGGS3g05i7eUdJLi6TcHa8OirJHmj7EpW0yFdwMo8&_nc_ohc=FYteGjx2r_kQ7kNvwE8i-eb&_nc_oc=Adp4gCphW4TepPFkfM_xLOTcjgvL0gjlBKM7VhCzXIY6LURrhDc2ICr8alUw829XF5o&_nc_zt=23&_nc_ht=scontent-bkk1-1.xx&_nc_gid=WLnPJRapiSYWrwTeia-1Sw&_nc_ss=7b2a8&oh=00_AQNGX1o0eipB_KQhkjwa_M8Zk7NN542ivg7YXeZS9wOzTQ&oe=6ACAEAB1',
      phone: '073-212-333',
      isLatest: true
    },
    {
      id: 42,
      name: 'ส้มโชกุนเบตง',
      category: 'อาหาร',
      zone: 'ชายแดนใต้',
      province: 'ยะลา',
      description: 'ส้มโชกุนผลใหญ่ เปลือกบาง เนื้อฉ่ำ หวานอมเปรี้ยว ปลูกในหุบเขาเบตง',
      producerName: 'กลุ่มเกษตรกรผู้ปลูกส้มโชกุนเบตง',
      imageUrl: 'https://down-th.img.susercontent.com/file/2a53caebcfb69974f16d9ee23bc04d84',
      phone: '073-231-888'
    },
    {
      id: 43,
      name: 'ผ้าปาเต๊ะมัดย้อม',
      category: 'ผ้าและเครื่องแต่งกาย',
      zone: 'ชายแดนใต้',
      province: 'ยะลา',
      description: 'ผ้าปาเต๊ะเขียนลายเพ้นท์มือ สีสันสดใส ผสานเอกลักษณ์วัฒนธรรมภาคใต้',
      producerName: 'กลุ่มผ้ามัดย้อมปาเต๊ะยะลา',
      imageUrl: 'https://mpics-cdn.mgronline.com/pics/Images/561000008002401.JPEG',
      phone: '073-222-111'
    },
    {
      id: 44,
      name: 'ปลากุเลาเค็มตากใบ',
      category: 'อาหาร',
      zone: 'ชายแดนใต้',
      province: 'นราธิวาส',
      description: 'ราชาแห่งปลาเค็ม ปลากุเลาตากแห้งเนื้อฟู หอม กลมกล่อม สินค้า GI ตากใบ',
      producerName: 'กลุ่มปลากุเลาเค็มตากใบแม่บ้านเกษตรกร',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSofu_EobZ5JJ0XwBKs38CJv_6FZj0qt-1TCKkRBtSWqg&s=10',
      phone: '073-581-122',
      isFeatured: true
    },
    {
      id: 45,
      name: 'ข้าวเกรียบปลาสด (กะโป๊ะ)',
      category: 'อาหาร',
      zone: 'ชายแดนใต้',
      province: 'นราธิวาส',
      description: 'ข้าวเกรียบปลาสดทอดกรอบ เนื้อปลาแน่น หอม อร่อย ทานคู่กับน้ำจิ้มสูตรเด็ด',
      producerName: 'กลุ่มกะโป๊ะนราธิวาส',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUHxMgKdWOuP4aIYoCuLsAx-3F893WTOrl4gQhHkueO_Bjs5KQCBrDejbx&s=10',
      phone: '073-512-333',
      isLatest: true
    },
    {
      id: 46,
      name: 'เรือกอและจำลอง',
      category: 'ของประดับตกแต่ง',
      zone: 'ชายแดนใต้',
      province: 'นราธิวาส',
      description: 'งานแกะสลักและวาดลวดลายเรือกอและจำลอง ถ่ายทอดศิลปะชาวประมงภาคใต้',
      producerName: 'กลุ่มศิลปะเรือกอและจำลองนราธิวาส',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAjdLm2gjWs2mD_A_ErpnyOMm8P97Fs6nI1_7Z71herw16OhM3gUNEniM&s=10',
      phone: '081-888-7766'
    },
  ];

  console.log('กำลังนำข้อมูลเข้าฐานข้อมูล...');

  for (const product of products) {
    // ลบฟิลด์ id ออกก่อนนำเข้า เพื่อให้ฐานข้อมูลสร้าง id อัตโนมัติ
    const { id, ...dataToInsert } = product; 
    
    // สร้างราคาและจำนวนสินค้าแบบสุ่มให้โดยอัตโนมัติ
    dataToInsert.price = Math.floor(Math.random() * 450) + 50; // สุ่มราคา 50 - 500 บาท
    dataToInsert.stock = Math.floor(Math.random() * 90) + 10;  // สุ่มสต๊อก 10 - 100 ชิ้น

    await prisma.product.create({
      data: dataToInsert,
    });
  }

  console.log('✅ นำเข้าข้อมูลสินค้าทั้งหมดพร้อมรายละเอียด (รวมราคาและสต๊อก) เรียบร้อยแล้ว!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });