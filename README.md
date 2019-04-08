# ข้อสอบ take home สำหรับ React Native

จุดประสงค์: เพื่อต้องการทดสอบความสามารถพื้นฐาน JavaScript ของผู้สมัคร

โปรดอ่านคำชี้แจงทั้งหมดก่อนเริ่มทำ

## การใช้งาน

1. ให้ติดตั้ง NodeJS เวอร์ชั่นล่าสุด
2. สั่ง `npm install`
3. สั่ง `npm run test`

คำแนะนำ สามารถใช้คำสั่ง `npm run test -- --watchAll` เพื่อให้ระบบรัน test ใหม่อัตโนมัติได้

## การส่งงาน

ให้สร้าง Git repository จากโฟล์เดอร์นี้ แล้วอัพโหลดขึ้น GitHub ของตัวเอง ตั้งเป็น public
จากนั้นแจ้ง URL กลับมาทางอีเมลโดยเลือกแบบ **Reply to All** เท่านั้น

กำหนดส่งงานคือ 7 วันตั้งแต่วันที่อีเมลโจทย์ถูกส่ง หรือตามแต่ตกลงกับ People team

เมื่อเจ้าหน้าที่แจ้งผลแล้วให้ลบ repository ออกจาก GitHub

## คำสั่ง
**ให้ทำให้ test ทั้งหมดของโปรแกรมนี้ผ่าน**

ในโจทย์นี้เราต้องการจะเขียน Library ที่ทำงานเหมือน [Redux](https://redux.js.org)

Redux เป็นไลบรารีจัดการข้อมูล state ที่มักนิยมใช้กับ React โดยจะมีการเก็บข้อมูลตั้งต้นไว้พร้อมกับ reducer function เรียกว่า Store
จากนั้นเมื่อต้องการเปลี่ยนแปลงข้อมูลให้ส่งข้อความ (Action) ไปหา Store ซึ่ง Store จะเรียก reducer function เพื่อคำนวณหา state ใหม่
และผู้ใช้งานไม่ควรจะแก้ไข state ผ่านช่องทางอื่นๆ นอกเหนือจากนี้

สำหรับการเขียนโปรแกรมนี้ มีรายละเอียดดังนี้

(ระวัง รายละเอียดบางอย่างอาจไม่เหมือน Redux)

1. ให้ export function ชื่อ `createStore(reducer, initialState)` ออกมาจากไฟล์ main (ทำให้แล้ว)
2. ฟังค์ชั่น `createStore` จะสร้าง `Store` class โดยใช้พารามิเตอร์ที่ส่งเข้าไป (ทำให้แล้ว)
3. Store class จะจัดเก็บ reducer function และ state ไว้ (ถือเป็น private ของ class)
4. Store จะมีฟังค์ชั่นดังต่อไปนี้
   1. `getState()` จะคืนค่า state ล่าสุด
   3. `replaceReducer(nextReducer)` จะเปลี่ยน reducer เป็นตัวใหม่ตามที่ส่งเข้ามา
   2. `dispatch(action)` จะเรียก `reducer(state, action)` แล้วนำ return value กำหนดเป็น state ใหม่
   4. `subscribe(listener)` จะทำให้หลังจากเรียก `dispatch` แล้วจะมีการเรียก `listener(state)` ตาม state ล่าสุด
      - ฟังค์ชั่นนี้จะต้อง return unsubscribe function ซึ่งเมื่อเรียกแล้วยกเลิกผลการลงทะเบียน (หลังจาก `dispatch` ครั้งถัดไปแล้วจะไม่มีการเรียก `listener` อีก)
      - unsubscribe function อาจถูกเรียกหลายครั้งได้ ให้มีผลเหมือนเรียกครั้งเดียว (idempotent)
      - Store สามารถมี listener ลงทะเบียนไว้หลายๆ ตัวพร้อมกันก็ได้
      - กำหนดให้ listener 1 function สามารถลงทะเบียนได้ครั้งเดียว ถ้าลงทะเบียนครั้งถัดไปให้มีผลเหมือนครั้งแรก (idempotent) เมื่อถูก unsubscribe แล้วสามารถนำกลับมาลงทะเบียนใหม่ได้
      - ใน listener function สามารถเรียก subscribe หรือ unsubscribe ซ้อนได้ รวมถึง unsubscribe ตัวเองด้วย
      - ใน listener function สามารถเรียก dispatch ได้ โดยให้มีการเรียก listener function ทุกตัวอีกครั้งหนึ่งด้วยค่า state ใหม่
5. reducer ที่ส่งเข้าไปจะไม่สามารถเรียกใช้ฟังค์ชั่นใดๆ ใน store ได้เลย รวมถึง unsubscribe function ด้วย

ในการทำโจทย์ เราได้แยกลำดับที่ควรทำไว้แล้วในไฟล์ test แนะนำให้รันทีละไฟล์โดยสั่ง `npm test -- step1.test.js --watchAll` หรือใน watch mode ให้พิมพ์ p แล้วพิมพ์ `step1` ก่อนส่งงานอย่าลืมรันทุก test ว่าไม่มี regression เกิดขึ้น

โจทย์นี้สามารถทำให้เสร็จได้ โดยไม่ต้องลง library เพิ่มเติมหรือแก้ไขไฟล์ test อย่าลืมว่าใน NodeJS เวอร์ชั่นล่าสุดก็สามารถใช้ ES7 functions ได้

## ลิขสิทธิ์
โค้ดบางส่วนมาจาก Redux ใช้งานภายใต้ MIT license สงวนลิขสิทธิ์ (c) 2015-present Dan Abramov
