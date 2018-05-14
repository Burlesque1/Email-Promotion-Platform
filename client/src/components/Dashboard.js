import React from "react";
import { Link } from "react-router-dom";
import SurveyList from "./surveys/SurveyList";
import SurveySummary from "./surveys/SurveySummary";

const Dashboard = () => {
  return (
    <div>
      <SurveySummary />
      <SurveyList />
      <div className="fixed-action-btn">
        <Link to="/surveys/new" className="btn-floating btn-large red">
          <i className="material-icons">add</i>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
