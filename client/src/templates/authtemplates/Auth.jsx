import React, { useState, useContext } from "react";
import { Button } from "../../components/ui/button";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { DraftShareContext } from "../../App";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import toast, { Toaster } from "react-hot-toast";

const Auth = () => {
  const { user, setUser, LOCAL_STORAGE_KEY } = useContext(DraftShareContext);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleloginchange = (event) => {
    const { id, value } = event.target;
    setLoginData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handlesigninchange = (event) => {
    const { id, value } = event.target;
    setSignupData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handlesignup = async () => {
    const { name, email, password } = signupData;
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/user/signup`,
        {
          name,
          email,
          password,
        }
      );

      if (response.status == 200) {
        setLoading(false);
        setUser({
          email: response.data.email,
          user_id: response.data.id,
          token: response.data.token,
        });
        toast.success("Signup successful");
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({
            email: response.data.email,
            user_id: response.data.id,
            token: response.data.token,
          })
        );
      } else if (response.status == 400) {
        console.log("Signup failed:", response.data.error);
      }
    } catch (error) {
      setLoading(false);

      toast.error(error?.response?.data?.error ?? "something went wrong", {
        icon: "❗",
      });
    }
  };

  const handlelogin = async () => {
    const { email, password } = loginData;
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/user/login`,
        {
          email,
          password,
        }
      );

      if (response.status == 200) {
        setLoading(false);
        setUser({
          email: response.data.email,
          user_id: response.data.id,
          token: response.data.token,
        });
        toast.success("Login successful");
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({
            email: response.data.email,
            user_id: response.data.id,
            token: response.data.token,
          })
        );
      } else if (response.status == 400) {
        console.log("Login failed:", response.data.error);
      }
    } catch (error) {
      setLoading(false);

      toast.error(error?.response?.data?.error ?? "something went wrong", {
        icon: "❗",
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-[85vh]">
        <Tabs defaultValue="login" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">LogIn</TabsTrigger>
            <TabsTrigger value="signup">SignUp</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader className="text-left">
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Login to continue the freedom of sharing contracts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-left">
                <div className="space-y-1">
                  <Label htmlFor="username">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    onChange={handleloginchange}
                    value={loginData.email}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    onChange={handleloginchange}
                    value={loginData.password}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <button onClick={handlelogin}>
                  <Button>LogIn</Button>
                </button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardHeader className="text-left">
                <CardTitle>SignUp</CardTitle>
                <CardDescription>
                  Signup for Draftshare 📝 now 🚀 🚀
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-left">
                <form action="">
                  <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="name"
                      onChange={handlesigninchange}
                      value={signupData.name}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      onChange={handlesigninchange}
                      value={signupData.email}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      onChange={handlesigninchange}
                      value={signupData.password}
                      type="password"
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <button onClick={handlesignup}>
                  <Button
                    id="signinsubmit"
                    type="submit"
                    onSubmit={handlesignup}
                  >
                    {" "}
                    SignUp
                  </Button>
                </button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Auth;
