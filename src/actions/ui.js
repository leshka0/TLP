import {
	UI_NAVIGATION_HIDE,
	UI_NAVIGATION_SHOW,
	UI_NAVIGATION_TOGGLE,
	UI_NAVIGATION_AUTO,
} from '../constants/action-types';

export function hideNavigation() {
	return {
		type: UI_NAVIGATION_HIDE,
	};
}

export function showNavigation() {
	return {
		type: UI_NAVIGATION_SHOW,
	};
}

export function toggleNavigation(status) {
	return {
		type: UI_NAVIGATION_TOGGLE,
		status,
	};
}

export function toggleNavigationAuto(status) {
	return {
		type: UI_NAVIGATION_AUTO,
		status,
	};
}
