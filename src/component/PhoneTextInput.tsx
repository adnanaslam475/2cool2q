import { BaseColor } from 'common/color';
import React, { useRef, forwardRef } from 'react';
import ReactNativePickerModule, {
    ReactNativePickerModuleProps,
} from 'react-native-picker-module';
import CountryPicker from 'react-native-country-picker-modal';

import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    TextInputProps,
    Dimensions,
} from 'react-native';
import styles from '../common/style';

type Props = {
    isInvalidPhone: {
        isActive: boolean;
        msg: string;
    };
    pickerProps: ReactNativePickerModuleProps;
    textInputProps: TextInputProps;
    cca2: string;
    callingCode: string;
    onPickerOpen: () => void;

    onCodeChanged: (value: string) => void;
    renderRightIcon?: JSX.Element;
    isEnable?: boolean;
    enabled?: boolean;
};

const COUNTRY_MODAL_STYLE = {
    primaryColor: BaseColor.primaryColor,
    primaryColorVariant: BaseColor.darkGrey,
    backgroundColor: BaseColor.primaryColor,
    onBackgroundTextColor: BaseColor.blackColor,
    fontSize: 16,
    filterPlaceholderTextColor: BaseColor.lightPrimaryColor,
    itemHeight: Dimensions.get('screen').height / 15,
};


const PhoneTextInput = forwardRef((props: Props, ref) => {
    const {
        isInvalidPhone,
        pickerProps: { value: prefix },
        onPickerOpen,
        onCodeChanged,
        renderRightIcon,
        isEnable = true,
        enabled = false,
        cca2 = "GB",
        callingCode = '+44',
    } = props;


    return (
        <>
            <View style={{ ...styles.textInputMargin }}>
                <Text style={{ ...styles.primaryText, marginTop: -12 }}>
                    {props.textInputProps.placeholder}
                </Text>
                <Text
                    style={[
                        styles.primaryText,
                        {
                            flex: 1,
                            marginLeft: 10,
                            fontSize: 12,
                            fontStyle: 'italic',
                            fontWeight: "600",
                            color: BaseColor.redColor
                        },
                    ]}>
                    {isInvalidPhone.isActive ? ` - ${isInvalidPhone.msg}` : ''}
                </Text>
                {renderRightIcon ? renderRightIcon() : null}
            </View>
            <View style={{ flexDirection: 'row', opacity: enabled ? 1 : 0.6, marginTop: -6 }}>
                <TouchableOpacity onPress={() => onPickerOpen()}>
                    <View
                        style={{ ...styles.flagContainer, borderWidth: enabled ? 1 : 0 }}>
                        <Text style={styles.countryCode}>{callingCode}</Text>
                        <CountryPicker
                            {...{
                                countryCode: cca2,
                                withFilter: true,
                                withFlag: true,
                                withCountryNameButton: false,
                                withAlphaFilter: true,
                                withCallingCode: true,
                                withEmoji: true,
                                onSelect: onCodeChanged,
                            }}
                            visible={false} >
                        </CountryPicker>
                    </View>
                </TouchableOpacity>
                <View style={{ flex: 2, marginLeft: -2 }}>
                    <TextInput
                        style={[
                            styles.primaryInput,
                            {
                                height: 40,
                                borderWidth: enabled  ? 1 : 0,
                                borderColor: isInvalidPhone.isActive
                                    ? BaseColor.redColor
                                    : BaseColor.borderColor,
                            },
                        ]}
                        editable={isEnable || enabled}
                        maxLength={11}
                        blurOnSubmit={false}
                        returnKeyType={'next'}
                        keyboardType={'number-pad'}
                        {...props.textInputProps}
                    />
                </View>
            </View>
        </>
    );
});

export default PhoneTextInput;
