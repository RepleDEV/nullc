import React, { Component } from "react";
import { Link } from "react-router-dom";

class PageReturn extends Component {
	render(): React.ReactNode {
		return (
			<div className="page-return-container">
				<Link to="/">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14.102"
						height="21.84"
						viewBox="0 0 14.102 21.84">
						<path
							id="angle-left-solid"
							d="M25.143,105.71l9.279-9.279a1.631,1.631,0,0,1,2.313,0l1.542,1.542a1.631,1.631,0,0,1,0,2.313l-6.57,6.584,6.577,6.577a1.631,1.631,0,0,1,0,2.313l-1.542,1.549a1.631,1.631,0,0,1-2.313,0l-9.279-9.279a1.633,1.633,0,0,1-.007-2.32Z"
							transform="translate(-24.662 -95.95)"
							fill="#fefdfd"
						/>
					</svg>
				</Link>
			</div>
		);
	}
}

export default PageReturn;
