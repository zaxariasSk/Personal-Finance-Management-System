import {NavLink} from "react-router-dom";
import ProfileComponent from "./ProfileComponent";
import styles from './menu.module.css';

const Menu = () => {

    return (
        <nav
            className={styles['navigation-container']}
            aria-label="Main navigation">
            <ul>
                <li>
                    <NavLink
                        to={'/dashboard'}
                        end={true}>
                        <img
                            src={'/images/homepage.svg'}
                            alt="homepage"
                            width="30"
                            height="30"
                        />
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to={'/income'}
                        end={true}>
                        <img
                            src={'/images/income.png'}
                            alt="homepage"
                            width="30"
                            height="30"
                        />
                    </NavLink>
                </li>
                <li>
                    <div className={styles.profile}>
                        <ProfileComponent />
                    </div>
                </li>
            </ul>
        </nav>
    )
}

export default Menu;
