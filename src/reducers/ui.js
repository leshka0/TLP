import { Record } from 'immutable';
import {
	UI_NAVIGATION_HIDE,
	UI_NAVIGATION_SHOW,
	UI_NAVIGATION_TOGGLE,
	UI_NAVIGATION_AUTO,
} from '../constants/action-types';

/**
 * Record is like a class, but immutable and with default values.
 * https://facebook.github.io/immutable-js/docs/#/Record
 */
const InitialState = Record({
	navigationVisibility: false,
});

export const initialState = new InitialState;

/**
 * [ui description]
 * @param  {Record} state  =  initialState [An immutable Record defined above]
 * @param  {function} action [Redux action. Defined in '/actions/ui.js']
 * @return {Record} a new copy of the state you passed into with any changes to it
 */
export default function ui(state = initialState, action) {
	switch (action.type) {
		case UI_NAVIGATION_HIDE: {
			return state.set('navigationVisibility', false);
		}
		case UI_NAVIGATION_SHOW: {
			return state.set('navigationVisibility', true);
		}
		case UI_NAVIGATION_AUTO:
		case UI_NAVIGATION_TOGGLE: {
			const { status } = action;
			return state.update('navigationVisibility',
				navigationVisibility => ((status === undefined) ? !navigationVisibility : status));
		}
		default: {
			return state;
		}
	}
}
