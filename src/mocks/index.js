import { Users, Task } from "./profile"
export const initData = () => {
  if (!localStorage.getItem('Users')){
    localStorage.setItem('Users', JSON.stringify(Users));
  }
  
  if ( !localStorage.getItem('Tasks')){
    localStorage.setItem('Tasks', JSON.stringify(Task));
  }
}
