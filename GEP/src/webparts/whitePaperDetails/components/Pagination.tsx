import * as React from "react";
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';

import './home-listing-page.css';

export interface IPaginationProps {
    currentPage: number;
    totalPages: number;
    onChange: (page: number) => void;
    limiter?: number;
    hideFirstPageJump?: boolean;
    hideLastPageJump?: boolean;
    limiterIcon?: string;
}

export interface IPaginationState {
    currentPage: number;
    paginationElements: number[];
    limiter: number;
}

export class Pagination extends React.Component<IPaginationProps, IPaginationState> {
    constructor(props: Readonly<IPaginationProps>) {
        super(props);
        let paginationElementsArray = [];
        for (let i = 0; i < props.totalPages; i++) {
            paginationElementsArray.push(i + 1);
        }
        this.state = {
            currentPage: props.currentPage,
            paginationElements: paginationElementsArray,
            limiter: props.limiter ? props.limiter : 3,
        };
        this.onClick = this.onClick.bind(this);
    }

    public componentWillReceiveProps(nextProps) {
        if(nextProps.currentPage != this.props.currentPage || nextProps.totalPages != this.props.totalPages){
            let paginationElementsArray = [];
            for (let i = 0; i < nextProps.totalPages; i++) {
                paginationElementsArray.push(i + 1);
            }
            this.setState({
                currentPage: nextProps.currentPage,
                paginationElements: paginationElementsArray,
            });
        }
    }

    public render(): React.ReactElement<IPaginationProps> {
        return (
            <div className="pagination">
                {!this.props.hideFirstPageJump &&
                    <a onClick={() => this.onClick(1)} className="pagination-prev"><i className="arrow left"></i></a>
                }
                {
                    this.state.paginationElements.map((pageNumber) => this.renderPageNumber(pageNumber))
                }
                {!this.props.hideLastPageJump &&
                    <a onClick={() => this.onClick(this.props.totalPages)} className="pagination-next"><i className="arrow right"></i></a>
                }
            </div>
        );
    }

    public onClick = (page: number) => {
        this.setState({ currentPage: page });
        this.props.onChange(page);
    }

    public renderPageNumber(pageNumber) {
        if (pageNumber === this.state.currentPage) {
            return (
                <a className="activepage" onClick={() => this.onClick(pageNumber)}>{pageNumber}</a>
            );
        }
        else {
            if (!(pageNumber < this.state.currentPage - this.state.limiter || pageNumber > this.state.currentPage + this.state.limiter)) {
                return (
                    <a className="inactivepage" onClick={() => this.onClick(pageNumber)}>{pageNumber}</a>);
            }
            // else if (!(pageNumber < this.state.currentPage - this.state.limiter - 1 || pageNumber > this.state.currentPage + this.state.limiter + 1)) {
            //     if (this.props.limiterIcon) {
            //         return (<a onClick={() => this.onClick(pageNumber)} />
            //         );
            //     }
            //     else {
            //         return (<a onClick={() => this.onClick(pageNumber)} />);
            //     }
            // }
            else {
                return;
            }
        }
    }
}
