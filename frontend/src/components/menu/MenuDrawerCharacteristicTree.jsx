import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	checkCharacteristic,
	uncheckCharacteristicById,
} from '../../_actions/characteristicAction';

// Components
import DialogCharacteristicDescription from '../dialog/DialogCharacteristicDescription';

// Constant
import { treeViewArr } from '../../constants/Constants';

// MUI
import { Box, Typography, Checkbox, IconButton } from '@mui/material';
import { TreeView, TreeItem } from '@mui/x-tree-view';
import {
	ExpandMoreRounded,
	ChevronRightRounded,
	ArrowDropDownCircleRounded,
} from '@mui/icons-material';

const sxBox = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	my: '10px',
	'& .MuiTypography-root': {
		fontSize: '14px',
	},
};

const MenuDrawerCharacteristicTree = () => {
	const dispatch = useDispatch();
	const checked_layers = useSelector((state) => state.characteristic.checked_layers);
	const ids = checked_layers.map((item) => item.id);

	const [selectedNode, setSelectedNode] = useState(null);
	const [openDialog, setOpenDialog] = useState(false);

	// get a random number between min and max
	// const randomBetween = (min = 0, max = 255) => min + Math.floor(Math.random() * (max - min + 1));

	// use bfs algorithm to find node by its id
	const getNodeById = (graph, id) => {
		const queue = [...graph];

		while (queue.length > 0) {
			const currNode = queue.shift();

			if (currNode.id === id) {
				return currNode;
			}

			if (currNode.children) {
				queue.push(...currNode.children);
			}
		}

		return []; // target node not found
	};

	const handleCheckNode = (event, nodeId) => {
		event.stopPropagation();

		const currNode = getNodeById(treeViewArr, nodeId);
		const parentNode = getNodeById(treeViewArr, currNode.parent);

		if (ids.includes(nodeId)) {
			// need to uncheck
			dispatch(uncheckCharacteristicById(nodeId));
		} else {
			// need to check
			dispatch(
				checkCharacteristic({
					id: nodeId,
					schema: parentNode.name,
					table: currNode.name,
					title: currNode.title,
					description: currNode.description,
					source: currNode.source,
					url: currNode.url,
					lineColor: [0, 122, 181], // ALL4LAND Blue, '#007ab5'
					fillColor: [137, 182, 64], // ALL4LAND Green, '#89B640'
				})
			);
		}
	};

	const handleSelectNode = (node) => {
		// as long as selected node is not a parent node...
		if (['accidents', 'routes', 'zones'].indexOf(node.name) === -1) {
			let newSelectedNode = null;
			if (node === selectedNode) {
				// if already selected
				newSelectedNode = null;
			} else {
				// if not selected
				newSelectedNode = node;
				setOpenDialog(!openDialog);
			}
			setSelectedNode(newSelectedNode);
		}
	};

	const handleChangeSetting = (event, nodeId) => {
		event.stopPropagation();
	};

	const displayTreeView = (treeViewArray) => {
		if (!treeViewArray) {
			return null;
		}

		return treeViewArray.map((item) => {
			return (
				<TreeItem
					key={item.id}
					nodeId={item.id}
					onClick={(event) => handleSelectNode(item)}
					label={
						<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
							{['accidents', 'routes', 'zones'].indexOf(item.name) === -1 && (
								<Checkbox
									onClick={(event) => handleCheckNode(event, item.id)}
									checked={ids.includes(item.id) ? true : false}
								/>
							)}
							{item.title}

							<Box sx={{ marginLeft: 'auto' }} />

							{/* 디스플레이 설정 변경 버튼 */}
							{ids.includes(item.id) && (
								<IconButton size='small' onClick={(event) => handleChangeSetting(event, item.id)}>
									<ArrowDropDownCircleRounded />
								</IconButton>
							)}
						</Box>
					}
				>
					{displayTreeView(item.children)}
				</TreeItem>
			);
		});
	};

	return (
		<React.Fragment>
			<Box sx={{ ...sxBox }}>
				<Typography sx={{ my: '10px' }}>해역특성 데이터셋</Typography>
			</Box>
			<Box>
				<TreeView
					multiSelect
					defaultCollapseIcon={<ExpandMoreRounded />}
					defaultExpandIcon={<ChevronRightRounded />}
					defaultExpanded={['1', '5', '12']}
					selected={ids}
				>
					{displayTreeView(treeViewArr)}
				</TreeView>
			</Box>

			{/* 데이터셋 설명 다이얼로그 */}
			{openDialog && selectedNode !== null && (
				<DialogCharacteristicDescription handleSelectNode={handleSelectNode} node={selectedNode} />
			)}
		</React.Fragment>
	);
};

export default MenuDrawerCharacteristicTree;
