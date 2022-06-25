declare interface MutualInfo {
	id: string;
	username: string;
	header: string;
	icon: string;
}

declare type MootsList = MutualInfo[];

export { MootsList, MutualInfo };
export default MootsList;
