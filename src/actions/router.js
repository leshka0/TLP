import { push } from 'react-router-redux'
import { toggleNavigationAuto } from './ui'

let _routerTimer;

export function pushRouter(url) {
	return (dispatch, getState) => {

		/* go to this url */
		dispatch(push(url));

		/* close siderbar after a timeout */
		if (!getState().ui.navigationVisibility) return;
		if (_routerTimer) {
			clearTimeout();
			_routerTimer = null;
		}
		_routerTimer = setTimeout(() => {
			dispatch(toggleNavigationAuto(false));
		}, 50);
	};
}
