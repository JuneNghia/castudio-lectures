import { Button, Form, FormProps, Input } from "antd";
import logoImg from "@renderer/assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import AuthService from "@renderer/services/auth.service";
import notify from "@renderer/common/function/notify";

type FieldType = {
  password: string;
  email: string;
  repassword: string;
  macAddress: string;
  fullName: string;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const macAddress = await window.electronAPI.getMacAddress();

const SignUp = () => {
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    AuthService.singUp(
      values.fullName,
      values.email,
      values.password,
      values.macAddress
    )
      .then(() => {
        notify("success", "Đăng ký tài khoản thành công");
        navigate("/sign-in");
      })
      .catch((err) => {
        notify("error", err.response?.data?.message);
      });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Helmet>
        <title>ĐĂNG KÝ TÀI KHOẢN</title>
      </Helmet>

      <div className="mb-8">
        <img src={logoImg} width={200} />
      </div>
      <Form
        name="sign-up"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        style={{ width: "100%" }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="MAC"
          name="macAddress"
          initialValue={macAddress}
          hidden
        >
          <Input disabled />
        </Form.Item>

        <Form.Item<FieldType>
          label="Họ và tên"
          name="fullName"
          rules={[
            { required: true, message: "Vui lòng nhập họ và tên" },
            { max: 60, message: "Họ và tên không được quá 60 ký tự" },
          ]}
        >
          <Input />
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
          label="Nhập lại mật khẩu"
          name="repassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng nhập lại mật khẩu" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu không trùng khớp"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 5, span: 8 }}>
          <div>
            Đã có tài khoản?{" "}
            <Link to={"/sign-in"} className="text-blue-700">
              Đăng nhập ngay
            </Link>
          </div>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 10 }}>
          <Button
            size="large"
            className="w-[30%]"
            type="primary"
            htmlType="submit"
          >
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignUp;
