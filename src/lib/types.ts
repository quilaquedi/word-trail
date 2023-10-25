export type Text = {
	id: number | string;
	rawForm: string;
	textPos: number;
}[];

export type Context = {
	wordId: string | number;
	text: string;
	wordLoc: number[];
};

export type Contexts = {
	same: Context[];
	spelling: Context[];
	meaning: Context[];
};

export type TextInfo = {
	id: number,
	title: string,
	language: string,
	slug: string
}
