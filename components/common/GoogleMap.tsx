"use client";
import { useEffect, useRef } from "react";
import { Typography, Form, Select, Input } from "antd";
import MainLayout from "@/app/layouts/page";
import dynamic from "next/dynamic";
const { Option } = Select;
const { TextArea } = Input;
const { Row, Col, Card, Button } = {
  Button: dynamic(() => import("antd").then((module) => module.Button), {
    ssr: false,
  }),
  Row: dynamic(() => import("antd").then((module) => module.Row), {
    ssr: false,
  }),
  Col: dynamic(() => import("antd").then((module) => module.Col), {
    ssr: false,
  }),
  Card: dynamic(() => import("antd").then((module) => module.Card), {
    ssr: false,
  }),
};
const GoogleMap = (props: any) => {
  const [form] = Form.useForm();
  const locationSearchRef = useRef(null);
  useEffect(() => {
    const loadGoogleMapScript = () => {
      if (!window.google) {
        const googleMapScript = document.createElement("script");
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDVyNgUZlibBRYwSzi7Fd1M_zULyKAPLWQ&libraries=places`;
        googleMapScript.onload = initPlaceAPI;
        document.body.appendChild(googleMapScript);
      } else {
        initPlaceAPI();
      }
    };
    const initPlaceAPI = () => {
      if (locationSearchRef.current) {
        let autocomplete = new window.google.maps.places.Autocomplete(
          locationSearchRef.current
        );
        autocomplete.addListener("place_changed", () => {
          let place = autocomplete.getPlace();

          console.log(place, "place");
        });
      }
    };
    loadGoogleMapScript();

    return () => {};
  }, []);

  return (
    <input
      className="custom-input"
      ref={(ref: any) => (locationSearchRef.current = ref)}
      placeholder="Enter your address"
    />
  );
};
export default GoogleMap;
