

export type Context = {
	compId: string | number,
	text: string,
	wordLoc: number[]
};

export type Comparisons = {
	same: Context[],
	similar: Context[],
	meaning: Context[],
};