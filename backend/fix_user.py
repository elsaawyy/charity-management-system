from app.core.database import SessionLocal 
from app.models.user import User 
 
db = SessionLocal() 
user = db.query(User).filter(User.username == 'mohamedmosbah').first() 
if user: 
    user.role = 'Staff' 
    db.commit() 
    print(f'Fixed user {user.username} role to {user.role}') 
else: 
    print('User not found') 
db.close() 
