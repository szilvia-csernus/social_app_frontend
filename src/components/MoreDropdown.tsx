import React, { forwardRef } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import styles from './MoreDropdown.module.css';

type MoreDropdownProps = {
	handleEdit: () => void;
	handleDelete: () => void;
}

const ThreeDots = forwardRef<
	HTMLElement,
	{ onClick: (e: React.MouseEvent<HTMLElement>) => void }
>(({ onClick }, ref) => (
	<i
		className="fas fa-ellipsis-v"
		ref={ref}
		onClick={(e: React.MouseEvent<HTMLElement>) => {
			e.preventDefault();
			onClick(e);
		}}
	/>
));

export const MoreDropdown = ({ handleEdit, handleDelete }: MoreDropdownProps) => {
	return (
		<Dropdown drop="start" className="ml-auto">
			<Dropdown.Toggle as={ThreeDots} />

			<Dropdown.Menu
				className="text-center"
			>
				<Dropdown.Item
					className={styles.DropdownItem}
					onClick={handleEdit}
					aria-label="edit"
				>
					<i className="fas fa-edit" />
				</Dropdown.Item>
				<Dropdown.Item
					className={styles.DropdownItem}
					onClick={handleDelete}
					aria-label="delete"
				>
					<i className="fas fa-trash-alt" />
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
};
