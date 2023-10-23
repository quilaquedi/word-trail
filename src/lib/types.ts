export type Text = {
	id: number | string;
	rawForm: string;
	textPos: number;
}[];

export type Context = {
	compId: string | number;
	text: string;
	wordLoc: number[];
};

export type Comparisons = {
	same: Context[];
	spelling: Context[];
	meaning: Context[];
};
