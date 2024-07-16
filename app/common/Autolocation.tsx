"use client"

import { Form } from "antd";
import React from "react";
import { useRef } from "react";
const [form] = Form.useForm();
let locationSearchRef= useRef<any>()
function loadGoogleMapScript(callback: any) {
  if (
    typeof (window as any).google === "object" &&
    typeof (window as any).google.maps === "object"
  ) {
    callback();
  } else {
    const googleMapScript = document.createElement("script");
    googleMapScript.src =`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`
    window.document.body.appendChild(googleMapScript);
    googleMapScript.addEventListener("load", callback);
  }
}
const runTry = (cb: any) => {
  loadGoogleMapScript(() => {
    cb();
  });
};
const initPlaceAPI = () => {
  debugger
  if (locationSearchRef?.current) {
    let autocomplete = new (window as any).google.maps.places.Autocomplete(
      locationSearchRef?.current?.input
    );
    autocomplete.addListener("place_changed", async () => {
      let place = autocomplete.getPlace();
      // console.log(place?.geometry);
      if (!place.geometry) {
        console.log("chla");
        // Toast.warning("Please enter a valid location");
        return;
      }
      const address = place?.address_components;
      const coordinate = place?.geometry?.location;

      // console.log(coordinate, "coordinate____");
      // console.log(coordinate?.lng(), "lng_____");
      // console.log(coordinate?.lat(), "lat______");

      let items: any = {};
      if (Array.isArray(address) && address?.length > 0) {
        let zipIndex = address.findIndex((res) =>
          res.types.includes("postal_code")
        );
        let administrativeAreaIndex = address?.findIndex((res) =>
          res?.types.includes("administrative_area_level_1", "political")
        );
        let localityIndex = address?.findIndex((res) =>
          res?.types?.includes("locality", "political")
        );
        let countryIndex = address?.findIndex((res) =>
          res?.types?.includes("country", "political")
        );

        if (zipIndex > -1) {
          items.postal_code = address[zipIndex]?.long_name;
        }
        if (administrativeAreaIndex > -1) {
          items.state = address[administrativeAreaIndex]?.long_name;
        }
        if (localityIndex > -1) {
          items.city = address[localityIndex]?.long_name;
        }
        if (countryIndex > -1) {
          items.country = address[countryIndex]?.long_name;
        }
        const heheheh = {
          address: place.formatted_address,
          country: items?.country,
          state: items?.state,
          city: items?.city,
          postal_code: items?.postal_code,
        } as any;
        const errors = form.getFieldsError();
        if (errors.length) {
          form?.setFields(
            errors.flatMap((res: any) => {
              if (!(res.name[0] in heheheh)) return [];
              console.log(
                !!heheheh[res.name[0]],
                heheheh[res.name[0]],
                heheheh,
                res.name
              );
              return {
                name: res.name,
                errors: !!heheheh[res.name[0]]
                  ? []
                  : [
                    `Please enter ` +
                    res.name[0].toString().replace("_", " "),
                  ],
              };
            })
          );
        }
        console.log(items);

        form?.setFieldValue("address", place.formatted_address);
        form?.setFieldValue("country", items?.country);
        form?.setFieldValue("city", items?.city);
      }
    });
  }
};

React.useEffect(() => {
  runTry(() => {
    setTimeout(() => {
      initPlaceAPI();
    }, 0);
  });
}, []);