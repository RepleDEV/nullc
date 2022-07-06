import PropTypes from "prop-types";

declare type EmptyObject = Record<string, unknown>;
declare type EmptyComponentState = EmptyObject;
declare interface BasicComponentProps {
	children?: PropTypes.ReactNodeLike | PropTypes.ReactNodeArray;
}

export { BasicComponentProps, EmptyComponentState, EmptyObject };
