import React, { useState, FunctionComponent, useEffect } from "react";
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

  const snapPhoto = async () => {
    const photo = await cameraRef?.takePictureAsync({ quality: 0 });
    onResult("Processing....");
    closeCamera();
    if (!photo) return;
    const manipResult = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: 500 } }],
      {
        compress: 0.5,
        format: ImageManipulator.SaveFormat.JPEG
      }
    );
    console.log("photo", manipResult.uri);
    const uri = manipResult.uri;
    const uriParts = uri.split(".");
    const fileType = uriParts[uriParts.length - 1];
    // Upload the image using the fetch and FormData APIs
    const formData = new FormData();
    formData.append("mrzphoto", {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`
    });

    // fetch("http://192.168.1.187:4000/mrz", {
    //   method: "POST",
    //   body: formData,
    //   headers: {
    //     "content-type": "multipart/form-data"
    //   }
    // });
    fetch("http://192.168.1.187:4000/mrz", {
      method: "POST",
      body: formData,
      headers: {
        "content-type": "multipart/form-data"
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.data);
        onResult(data.data);
      })
      .catch(err => {
        console.log(err);
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
                fontSize: 18,
                alignItems: "center",
                marginTop: 50,
                color: "white"
              }}
            >
              {" "}
              Snap{" "}
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};
