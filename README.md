![justlogo](https://github.com/Brondee/client_connect/assets/99086730/b56b3c23-0882-4548-95b4-01cd25075966)
# Client Connect
A telegram bot, which helps you to book an appointment.
Made using Aiogram, React + Redux + Router Dom, Nest + Prisma + PostreSQL, Docker. Also connected with payment system, which is being used in bot subscription system. 
## 📕 Booking system
The booking system is simple and user friendly. After typing start command, there will appear a booking button, after clicking on it, a web app will be opened, where user can book an appointment. 

![firstscreens](https://github.com/Brondee/client_connect/assets/99086730/cc68d43b-b94f-4169-bc25-b500f408d818)

![secondscreens](https://github.com/Brondee/client_connect/assets/99086730/9e1b6674-3f28-4e17-834a-bd220d4a59c1)

✅ When user confirmed the appointment, the bot will automatically send a notification message to an admin chat.
Also it will automatically remove all the booked time, including time, that will be needed for providing the service.

## ⚙️ Admin panel
Admin can access admin panel by typing command /admin_#password#, the admin password is generated with bot creation. After typing the command, an admin panel button will appear, after clicking it a web app will be opened. All the information can be edited or added.

![adminfirst](https://github.com/Brondee/client_connect/assets/99086730/f878b8df-ec3b-4d3e-ab72-9a227f812b02)

![adminsecond](https://github.com/Brondee/client_connect/assets/99086730/40a3c774-ef7d-4e37-9323-c4e4826cefb3)

## 🚀 Some ideas:
1. Create website, which will show all the appointmens and some statistics
2. Create free version of the bot
3. Create a system, which will automatically create a new version of the bot for a new user
4. Somehow optimize the hall bot and create tests
