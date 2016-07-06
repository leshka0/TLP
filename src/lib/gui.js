import dat from 'dat-gui';

class Folder{
	add(){return this}
	listen(){return this}
	name(){return this}
	open(){return this}
	close(){return this}
	onChange(){return this}
	addFolder(){return this}
	addColor(){return this}
}

class GUIWrapper{
	add(){return this}
	addFolder(){return new Folder()}
	addColor(){return this}
	listen(){return this}
	name(){return this}
	close(){return this}
	step(){return this}
	onChange(){return this}
	setValue(){return this}
}

export default function GUI ( enable = true ) {

	let Cls = dat.GUI;

	if(!enable){
		Cls = GUIWrapper;
	}

	return new Cls;
}
