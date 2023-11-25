import copyBoard from "../../utils/copyBoard";
import BoardData from "../../Types/BoardData";
import {BOARDSTATE} from "../../Types/BoardState";
import {CELLSTATE} from "../../Types/CellState";
import Pos from "../../Types/Pos";
import {ALGORITHM} from "./ALGORITHM";
import {PathfindingAlgorithm} from "./PathfindingAlgorithm";

export default class DfsPathfinder extends PathfindingAlgorithm {
	name = "DFS";
	index = ALGORITHM.dfs;
	posStack: Pos[];
	shortestPath: Pos[];

	initPathfinding(board: BoardData, startingPosition: Pos) {
		super.initPathfinding(board, startingPosition);
		const adjacentPositions = this.getCellAtPos(startingPosition).edgesToValid().map(({
																																												start,
																																												end
																																											}) => {
			end.setParent(start);
			return end.position;
		});
		this.posStack = [...adjacentPositions];

	}

	noMoreSteps() {
		return this.posStack.length <= 0;
	}

	executeStep() {
		if (this.noMoreSteps()) {
			this.board.state = BOARDSTATE.searchComplete;
			return {
				board: this.board,
			};
		}

		const currentCell = this.getCellAtPos(this.posStack.pop());
		if (!currentCell.isTravelValid()) {
			this.board.state = BOARDSTATE.searching;
			return {
				board: this.board,
			}
		}

		if (currentCell.state === CELLSTATE.target) {
			this.foundTargetPosition = currentCell.position;
		} else {
			const edgesToValid = currentCell.edgesToValid();
			const adjacentPositions = currentCell.edgesToValid().map(({end}) => end.position);

			this.posStack.push(...adjacentPositions);
			edgesToValid.forEach(({start, end}) => {
				end.setParent(start);
			});

			currentCell.visit();
		}

		if (this.foundTargetPosition || this.posStack.length === 0) {
			this.board.state = BOARDSTATE.searchComplete;
		} else {
			this.board.state = BOARDSTATE.searching;
		}

		return {
			board: copyBoard(this.board),
			path: this.foundTargetPosition ? this.getPathToPosition(this.foundTargetPosition) : undefined
		};
	}
}