import React, { Component } from 'react';
import { View } from 'react-native';
import Animated, { Value, event, cond, eq, set, add } from 'react-native-reanimated';
import { PanGestureHandler, State } from 'react-native-gesture-handler';


const styles = {
	box: {
		height: 100,
		width: 100,
		backgroundColor: '#018282',
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	}
}

function interaction(gestureTranslation, gestureState) {
	const start = new Value(0);
	const dragging = new Value(0);
	const position = new Value(0);

	return cond(
		eq(gestureState, State.ACTIVE),
		[
			cond(eq(dragging, 0), [set(dragging, 1), set(start, position)]),
			set(position, add(start, gestureTranslation)),
		],
		[set(dragging, 0), position]
	);
}

export default class App extends Component {
	constructor(props) {
		super(props)
		
		const gestureX = new Value(0);
		const state = new Value(-1);

		this._onGestureEvent = event([
			{
				nativeEvent: {
					translationX: gestureX,
					state: state
				},
			}
		]);

		this._transX = interaction(gestureX, state)
	}

	render() {
		return (
			<View style={styles.container}>
				<PanGestureHandler
					onGestureEvent={this._onGestureEvent}
					onGestureStateChange={this._onGestureEvent}
				>
					<Animated.View style={{
						...styles.box,
						transform: [{ translateX: this._transX }]
					}} /> 
				</PanGestureHandler>
			</View>
		)
	}
}