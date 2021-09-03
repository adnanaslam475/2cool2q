import { BaseColor } from "../../common/color";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Moment from 'moment';							

										 
					  
						
							 
					 
						  
						
					
						 
	  
			 
							 
				  
				   
										 
				   
	  
   

export enum ChatBubbleDirection {
    Left,
    Right,
}

interface ChatBubbleProps {
    text: string;
    direction: ChatBubbleDirection;
    timestamp: string;					  
}

export function ChatBubble(props: ChatBubbleProps): JSX.Element {
    
    const directionStyles = StyleSheet.create({
        bubbleContainer: {
            flex: 1,
            textAlign: "left",
            borderRadius: 5,
            padding: 10,
            marginBottom: 10,

            alignSelf:
                props.direction === ChatBubbleDirection.Right
                    ? "flex-end"
                    : "flex-start",
            backgroundColor:
                props.direction === ChatBubbleDirection.Left
                    ? "#EBEBEB"
                    : BaseColor.primaryBlueColor,
        },
        text: {
            color:
                props.direction === ChatBubbleDirection.Left
                    ? "#333333"
                    : "#FFFFFF",						 
        },
        timestamp: {
            marginBottom: 
            props.direction === ChatBubbleDirection.Left
                ? 10
                : 0,
            marginTop: 
            props.direction === ChatBubbleDirection.Left
                ? 0
                : 20,
            marginLeft: 10,
            marginRight: 10,
            color: "#C0C0C0",
            fontSize: 10,
            alignSelf:
            props.direction === ChatBubbleDirection.Left
                ? "flex-start"
                : "flex-end",
        },
        timestampContainer: {
					
								 
            width: "20%",
            alignSelf:
            props.direction === ChatBubbleDirection.Right
                ? "flex-start"
                : "flex-end",
                },		  
        speech: {
            position: "absolute",
            width: 10,
            height: 10,
            transform: [{ rotate: "45deg" }],
            bottom: -5,

            [props.direction === ChatBubbleDirection.Left
                ? "left"
                : "right"]: -5,
            backgroundColor:
                props.direction === ChatBubbleDirection.Left
                    ? "#EBEBEB"
                    : BaseColor.primaryBlueColor,
        },
    });
    const bubbleStyles = StyleSheet.flatten([
        directionStyles.bubbleContainer,
    ]);
    const speechStyles = StyleSheet.flatten([
        directionStyles.speech,
    ]);
    return (
       <View style={{ flexDirection: "row",  }}>
           {props.direction === ChatBubbleDirection.Right && (
             <View style={directionStyles.timestampContainer}> 
                <Text style={directionStyles.timestamp}>{Moment(props.timestamp).format('hh:mm')}</Text>
            </View>)
            }
            <View style={bubbleStyles}>
                <Text style={directionStyles.text}>{props.text}</Text>
                <View style={speechStyles} />
            </View>
            {props.direction === ChatBubbleDirection.Left && (
             <View style={directionStyles.timestampContainer}> 
                <Text style={directionStyles.timestamp}>{Moment(props.timestamp).format('hh:mm')}</Text>
            </View>)
            }
        </View>
    );
}
