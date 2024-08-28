import { Button, Checkbox, Form, FormProps, Input, Tooltip } from "antd";
import logoImg from "@renderer/assets/logo.png";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import useAuth from "@renderer/hooks/useAuth";
import notify from "@renderer/common/function/notify";

type FieldType = {
  password: string;
  email: string;
  remember?: string;
  macAddress: string;
};

const macAddress = await window.electronAPI.getMacAddress();

const SignIn = () => {
  const auth = useAuth();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    auth
      .signIn(values.email, values.password, values.macAddress)
      .then(() => {
        notify("success", "Đăng nhập thành công");

        setTimeout(() => {
          window.electronAPI.resetApp();
        }, 500);
      })
      .catch((err) => {
        notify("error", err.response?.data?.message);
      });
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Helmet>
        <title>ĐĂNG NHẬP</title>
      </Helmet>

      <div className="mb-8">
        <img src={logoImg} width={200} />
      </div>
      <Form
        name="sign-in"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        style={{ width: "100%" }}
        initialValues={{
          email: "nguyenminhtrungnghia@gmail.com",
          password: "Nmtn2006",
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="MAC"
          name="macAddress"
          initialValue={macAddress}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item<FieldType>
          label="Địa chỉ email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập địa chỉ email" },
            { type: "email", message: "Địa chỉ email không hợp lệ" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 5, span: 16 }}
        >
          <div className="flex justify-between">
            <Tooltip title="Duy trì đăng nhập trong 7 ngày">
              <Checkbox disabled checked>
                Duy trì đăng nhập
              </Checkbox>
            </Tooltip>

            <div>
              Chưa có tài khoản?{" "}
              <Link to={"/sign-up"} className="text-blue-700 cursor-pointer">
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 10 }}>
          <Button
            size="large"
            className="w-[30%]"
            type="primary"
            htmlType="submit"
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignIn;
