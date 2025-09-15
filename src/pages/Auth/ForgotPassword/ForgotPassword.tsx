import { Avatar, Flex, Layout, Typography } from 'antd';
import React from 'react';
import styles from '../Auth.module.css';

import logo from '../../../assets/icons/task.png';
import picture from '../../../assets/images/computer.jpg';
import FormForgotPassword from './FormForgotPassword';
import { FaGithubAlt } from 'react-icons/fa6';

const { Footer } = Layout;

const ForgotPassword: React.FC = () => {
	return (
		<Layout className="!min-h-screen">
			<Flex align='center' justify='center' className={styles.login}>
				<section className={styles.sectionLeft}>
					<Flex align='center' vertical>
						<p></p>
						<Flex align='center' className={styles.title}>
							<img src={logo} alt="Logo" width={60} className={styles.logo} />
							<Typography.Title level={1}>Fluxo Ágil</Typography.Title>
						</Flex>
						<div className={styles.form} style={{ width: '20vw' }}>

							<FormForgotPassword />
						</div>
					</Flex>
				</section>

				<section className={styles.sectionRigth}>
					<img src={picture} alt="Picture" className={styles.picture} />
				</section>
			</Flex>
			<Footer className="text-center">
				<span className="!mr-2">Fluxo Ágil ©2025</span>
				<a
					href=""
					target="_blank"
					rel="noopener noreferrer"
				>
					<Avatar
						icon={<FaGithubAlt />}
						className="!bg-black text-white"
					/>
				</a>
			</Footer>
		</Layout>
	);
};

export default ForgotPassword;
