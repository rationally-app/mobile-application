import React, {
  useState,
  FunctionComponent,
  useEffect,
  useContext
} from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Platform
} from "react-native";
import { size } from "../../common/styles";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Camera } from "expo-camera";
import { AuthContext } from "../../context/auth";

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  inputAndButtonWrapper: {
    marginTop: size(3),
    flexDirection: "row",
    alignItems: "flex-end"
  },
  inputWrapper: {
    flex: 1,
    marginRight: size(1)
  },
  cameraWrapper: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});

interface MrzCamera {
  onResult: (id: string) => void;
  closeCamera: () => void;
}

export const MrzCamera: FunctionComponent<MrzCamera> = ({
  onResult,
  closeCamera
}) => {
  const { sessionToken, endpoint } = useContext(AuthContext);
  const [cameraRef, setCameraRef] = useState<Camera | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        // const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const snapPhoto = async (): Promise<void> => {
    const photo = await cameraRef?.takePictureAsync({ quality: 0.5 });
    onResult("Processing....");
    closeCamera();
    if (!photo) return;

    console.log(photo.height);
    console.log(photo.width);
    // ratio is 4:3
    const manipResult = await ImageManipulator.manipulateAsync(
      photo.uri,
      [
        { resize: { width: 500 } },
        {
          crop: {
            originX: 0,
            originY: (500 / photo.width) * photo.height * 0.4,
            width: 500,
            height: (500 / photo.width) * photo.height * 0.2
          }
        }
      ],
      {
        // compress: 0.5,
        format: ImageManipulator.SaveFormat.PNG
      }
    );
    console.log("photo", manipResult.uri);
    const uri = manipResult.uri;
    const uriParts = uri.split(".");
    const fileType = uriParts[uriParts.length - 1];
    // Upload the image using the fetch and FormData APIs
    const formData = new FormData();
    const blobData = {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`
    } as any;
    // formData.append("mrzphoto", {
    //   uri,
    //   name: `photo.${fileType}`,
    //   type: `image/${fileType}`
    // });
    formData.append("mrzphoto", blobData);

    fetch(`${endpoint}/mrz`, {
      // fetch("http://192.168.50.57:4000/mrz", {
      // fetch("http://192.168.1.187:4000/mrz", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: sessionToken,
        "content-type": "multipart/form-data"
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.data);
        const details = data.data;
        const passportNoField = details.find(
          (field: { field: string; value: string }) => {
            return field.field === "documentNumber";
          }
        );
        const nationalityField = details.find(
          (field: { field: string; value: string }) => {
            return field.field === "issuingState";
          }
        );
        console.log("Passport", passportNoField.value);
        passportNoField && nationalityField
          ? onResult(`${nationalityField.value}-${passportNoField.value}`)
          : onResult("MRZ not recognized");
      })
      .catch(err => {
        console.log(err);
        onResult("MRZ not recognized");
      });
  };

  return (
    <View style={styles.cameraWrapper}>
      <Camera
        style={{ flex: 1 }}
        type={Camera.Constants.Type.back}
        ref={ref => setCameraRef(ref)}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            backgroundColor: "black",
            opacity: 0.5,
            height: "40%"
          }}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "row"
          }}
        ></View>
        <View
          style={{
            backgroundColor: "black",
            opacity: 0.5,
            height: "40%"
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "column",
              alignSelf: "center",
              alignItems: "center"
            }}
            onPress={snapPhoto}
          >
            <Text
              style={{
                fontSize: 28,
                borderColor: "white",
                borderRadius: 10,
                borderWidth: 2,
                padding: 10,
                alignItems: "center",
                marginTop: 50,
                color: "white"
              }}
            >
              {" "}
              Snap MRZ{" "}
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};
