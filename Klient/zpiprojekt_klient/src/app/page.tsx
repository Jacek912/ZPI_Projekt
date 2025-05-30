import Image from "next/image";
import LoginForm from "@/app/components/loginPage/page";
import RegistrationForm from "@/app/components/registrationPage/page";
import ProductForm from "./components/addproductPage/page";
import Dashboard from "./components/dashboard/page";

export default function Home() {
  return (
    <Dashboard/>
  );
}
