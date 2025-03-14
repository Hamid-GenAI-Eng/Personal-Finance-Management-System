import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faBars, faHome, faDollarSign, faBullseye, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import BudgetManager from "./Budget";
import ExpensesManager from "./Expenses";
import InvestmentTracker from "./Investment";
import FinanceGoals from "./financeGoals";

import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        navigate("/login");
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <nav className={`side-bar ${isExpanded ? "expanded" : ""}`}>
                <div className="toggle-btn" onClick={toggleSidebar}>
                    <FontAwesomeIcon icon={faBars} />
                </div>
                <ul className="menu"> 
                    <li className="menu-item" title="Dashboard" onClick={() => navigate("/")}> 
                        <FontAwesomeIcon icon={faHome} className="icon" />
                        {isExpanded && <span>Dashboard</span>}
                    </li>
                    <li className="menu-item" title="Budgets" onClick={() => navigate("/budget")}>

                        <FontAwesomeIcon icon={faDollarSign} className="icon" />
                        {isExpanded && <span>Budgets</span>}
                    </li>
                    <li className="menu-item" title="Goals" onClick={() => navigate("/financegoal")}>
                        <FontAwesomeIcon icon={faBullseye} className="icon" />
                        {isExpanded && <span>Goals</span>}
                    </li>
                    <li className="menu-item" title="Statistics" onClick={() => navigate("/investmentTracker")}>
                        <FontAwesomeIcon icon={faChartLine} className="icon" />
                        {isExpanded && <span>Statistics</span>}
                    </li>
                    <li className="menu-item logout" title="Logout" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
                        {isExpanded && <span>Logout</span>}
                    </li>
                </ul>
            </nav>

            {/* Main Content */}
            <div className={`main-content ${isExpanded ? "shifted" : ""}`}>
                <header className="header">
                    <span className="welcome-text">Salam, Welcome back <strong>Hamid!</strong></span>
                    <input type="text" placeholder="Search" className="search-box" />
                </header>
                <div className="cards-container">
                    <div className="card balance-card">
                        <span className="card-title">Balance</span>
                        <h2>$265,9874,72</h2>
                        <div className="card-footer">
                            <span>2765 8437 9087 ****</span>
                            <span className='expiry-date'>27/22</span>
                        </div>
                    </div>
                    <div className="card income-card">
                        <span className="card-title">Income</span>
                        <h2>$62,870.14</h2>
                        <div className="card-footer-inline">
                            <span className="card-subtext">This week's income</span>
                            <span className="status positive">+ 12.23%</span>
                        </div>
                    </div>
                    <div className="card expenses-card" onClick={() => navigate("/expenses")}>
                        <span className="card-title">Expenses</span>
                        <h2>$70,235.87</h2>
                        <div className="card-footer-inline">
                            <span className="card-subtext">This week's expenses</span>
                            <span className="status negative">- 15.74%</span>
                        </div>
                    </div>
                    <div className="card invest-card extra-width" onClick={() => navigate("/investment")}>
                        <h2><span className="card-title">Your Investments</span></h2>
                        <div className="invest-list"></div>
                    </div>
                    <div className="card stats-card" onClick={() => navigate("/investmentTracker")}>
                        <h3>Your Finance statistics</h3>
                        <div className="card-footer-inline">
                            <h4>No Goal set</h4>
                        </div>
                    </div>
                    <div className="card savings-card" onClick={() => navigate("/financegoal")}>
                        <h3>Set goals</h3>
                        <div className="card-footer-inline">
                            <h4>No Goal set</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;