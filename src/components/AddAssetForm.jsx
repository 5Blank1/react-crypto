import React, { useRef, useState } from "react";
import {
  Select,
  Space,
  Divider,
  Form,
  DatePicker,
  InputNumber,
  Button,
  Result,
} from "antd";
import { useCrypto } from "../context/cryptoContext.jsx";
import { useForm } from "antd/es/form/Form.js";
import CoinInfo from "./CoinInfo.jsx";

const AddAssetForm = ({ onClose }) => {
  const [coin, setCoin] = useState(null);
  const { crypto, addAsset } = useCrypto();
  const [form] = useForm();
  const [submit, setSubmit] = useState(false);
  const assetRef = useRef();

  const handleAmountChange = (value) => {
    const price = form.getFieldValue("price");
    form.setFieldsValue({
      total: +(value * price).toFixed(2),
    });
  };

  const handlePriceChange = (value) => {
    const amount = form.getFieldValue("amount");
    form.setFieldsValue({
      total: +(amount * value).toFixed(2),
    });
  };

  const validateMessages = {
    required: "${label} is required",
    types: {
      number: "${label} is not valid number",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  if (submit && assetRef.current) {
    return (
      <Result
        status="success"
        title="New asset added!"
        subTitle={`Added ${assetRef.current?.amount} of ${coin.name} by price ${assetRef.current?.price}. Total price was ${assetRef.current?.total}`}
        extra={[
          <Button type="primary" key="console" onClick={onClose}>
            Close
          </Button>,
        ]}
      />
    );
  }

  if (!coin) {
    return (
      <Select
        style={{
          width: "100%",
        }}
        onSelect={(v) => setCoin(crypto.find((c) => c.id === v))}
        placeholder="Select coin"
        options={crypto.map((coin) => ({
          label: coin.name,
          value: coin.id,
          icon: coin.icon,
        }))}
        optionRender={(option) => (
          <Space>
            <img
              style={{ width: 20 }}
              src={option.data.icon}
              alt={option.data.label}
            />{" "}
            {option.data.label}
          </Space>
        )}
      />
    );
  }

  function onFinish(values) {
    const newAsset = {
      id: coin.id,
      amount: values.amount,
      price: values.price,
      total: values.total,
      date: values.date?.$d ?? new Date(),
    };
    assetRef.current = newAsset;

    setSubmit(true);
    addAsset(newAsset);
  }

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{
        span: 4,
      }}
      wrapperCol={{
        span: 10,
      }}
      style={{
        maxWidth: 600,
      }}
      initialValues={{ price: +coin.price.toFixed(2) }}
      onFinish={onFinish}
      validateMessages={validateMessages}
    >
      <CoinInfo coin={coin} />
      <Divider />

      <Form.Item
        label="Amount"
        name="amount"
        rules={[
          {
            required: true,
            type: "number",
            min: 0,
          },
        ]}
      >
        <InputNumber
          placeholder="Enter coin amount"
          style={{ width: "100%" }}
          onChange={handleAmountChange}
        />
      </Form.Item>

      <Form.Item label="Price" name="price">
        <InputNumber onChange={handlePriceChange} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Date & Time" name="date">
        <DatePicker showTime />
      </Form.Item>

      <Form.Item label="Total" name="total">
        <InputNumber disabled style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button
          type="primary"
          htmlType="submit"
          onClick={() => setSubmit(!submit)}
        >
          Add Asset
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddAssetForm;
