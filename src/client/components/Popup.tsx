import React, { Component } from "react";
import { Popup as PopupTypes } from "../types/Components";

class Popup extends Component<
	PopupTypes.PopupProps,
	{
		is_visible: boolean;
		popup_style: React.CSSProperties;
	}
> {
	container_ref?: HTMLDivElement;
	popup_ref?: HTMLDivElement;

	constructor(props: PopupTypes.PopupProps) {
		super(props);

		this.state = {
			is_visible: false,
			popup_style: {},
		};

		this.toggleVisible = this.toggleVisible.bind(this);
	}

	toggleVisible() {
		this.setState({ is_visible: !this.state.is_visible });
	}

	componentDidUpdate() {
		if (
			!this.container_ref ||
			!this.popup_ref ||
			Object.keys(this.state.popup_style).length
		)
			return;

		const container_rect = this.container_ref.getClientRects().item(0);
		if (!container_rect) return;
		const { x, y, width, height } = container_rect;
		const center_south_side_x = x + width / 2;
		const center_south_side_y = y + height;

		const popup_rect = this.popup_ref.getClientRects().item(0);
		if (!popup_rect) return;

		let popupX = center_south_side_x - popup_rect.width / 2;
		let popupY = center_south_side_y;

		const edgeMargin = this.props.edgeMargin || 10;

		const vw = Math.max(
			document.documentElement.clientWidth || 0,
			window.innerWidth || 0
		);
		const vh = Math.max(
			document.documentElement.clientHeight || 0,
			window.innerHeight || 0
		);

		if (popupX < edgeMargin) popupX = edgeMargin;
		else if (popupX + popup_rect.width > vw - edgeMargin)
			popupX -= popupX + popup_rect.width - vw + edgeMargin;

		if (popupY + popup_rect.height > vh)
			popupY -= height + popup_rect.height;

		this.setState({
			popup_style: {
				left: popupX,
				top: popupY,
			},
		});
	}

	render(): React.ReactNode {
		const { is_visible, popup_style } = this.state;
		const { element, children } = this.props;

		return (
			<>
				{is_visible ? (
					<div
						className="popup"
						style={popup_style}
						ref={(ref) => {
							if (ref) this.popup_ref = ref;
						}}>
						{element}
					</div>
				) : (
					<></>
				)}
				<div
					ref={(ref) => {
						if (ref) this.container_ref = ref;
					}}
					className="click-container"
					onClick={this.toggleVisible}>
					{children}
				</div>
			</>
		);
	}
}

export default Popup;
