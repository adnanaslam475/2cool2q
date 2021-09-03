import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { View, Image, TouchableOpacity } from "react-native";
import ViewPager from "@react-native-community/viewpager";
import Modal from "react-native-modal";
import Styles from "../../styles/commonScreens/imageSlider";
import {
  ICON_LEFT_ARROW_GRAY,
  ICON_CROSE,
  ICON_RIGHT_ARROW_GRAY,
  ICON_RIGHT_ARROW_WHITE,
  ICON_LEFT_ARROW_WHITE,
} from "../../assets/index";
var _scroll_index = 0;

// eslint-disable-next-line react/display-name
export const ImageSlider = forwardRef((props, ref) => {
  const [scroll_index, setScrollIndex] = useState(0);
  const [isBannerImage, setBannerImage] = useState(false);
  const viewPager = useRef();

  useEffect(() => {
    _scroll_index = 0;
  }, []);

  useImperativeHandle(ref, () => ({
    open: () => {
      setBannerImage(true);
    },
    showAlert() {
      alert("Child Function Called");
    },
  }));

  return (
    <Modal isVisible={isBannerImage} style={Styles.mainModal}>
      <View style={Styles.container}>
        <View style={Styles.mainView}>
          <View style={Styles.mainViewContainer}>
            <ViewPager
              ref={viewPager}
              onPageSelected={(e) => {
                _scroll_index = e.nativeEvent.position;
                setScrollIndex(_scroll_index);
              }}
              style={Styles.mainContainer}
              initialPage={0}
            >
              {props.props.getPhotos().map((obj, index) => {
                return (
                  <View key={index}>
                    <Image
                      style={Styles.imageSize}
                      source={{
                        uri: obj.photo_link.includes("http")
                          ? obj.photo_link
                          : "https://conversation.which.co.uk/wp-content/uploads/2018/09/unnamed.png",
                      }}
                      resizeMode="stretch"
                    />
                  </View>
                );
              })}
            </ViewPager>
            <TouchableOpacity
              style={Styles.selectImage}
              onPress={() => {
                if (_scroll_index >= 1) {
                  viewPager.current &&
                    viewPager.current.setPageWithoutAnimation(
                      _scroll_index - 1
                    );
                }
              }}
            >
              <View style={Styles.imageView}>
                {_scroll_index == 0 && (
                  <Image
                    style={Styles.iconSize}
                    source={ICON_LEFT_ARROW_GRAY}
                    resizeMode="stretch"
                  />
                )}
                {_scroll_index != 0 && (
                  <Image
                    style={Styles.iconSize}
                    source={ICON_LEFT_ARROW_WHITE}
                    resizeMode="stretch"
                  />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={Styles.selectScroll}
              onPress={() => {
                if (
                  _scroll_index >= 0 &&
                  _scroll_index < props.props.getPhotos().length - 1
                ) {
                  viewPager.current &&
                    viewPager.current.setPageWithoutAnimation(
                      _scroll_index + 1
                    );
                }
              }}
            >
              <View style={Styles.mainImageView}>
                {_scroll_index == props.props.getPhotos().length - 1 && (
                  <Image
                    style={Styles.iconSize}
                    source={ICON_RIGHT_ARROW_GRAY}
                    resizeMode="stretch"
                  />
                )}
                {_scroll_index < props.props.getPhotos().length - 1 && (
                  <Image
                    style={Styles.iconSize}
                    source={ICON_RIGHT_ARROW_WHITE}
                    resizeMode="stretch"
                  />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={Styles.imageClick}
              onPress={() => {
                setBannerImage(false);
              }}
            >
              <Image
                style={Styles.iconSizeValue}
                source={ICON_CROSE}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});
