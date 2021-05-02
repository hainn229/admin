import React from "react";
import { Route, Switch } from "react-router-dom";
import { Dashboard } from "./Dashboard";
import { Users } from "./Users";
import { Categories } from "./Categories";
import { Courses } from "./Courses";
import { AddCourse } from "./AddCourse";
import { AdminCourses } from "./AdminCourses";
import { Comments } from "./Comments";

export const Router = () => {
  return (
    <Switch>
      <Route exact={true} path="/" component={Dashboard} />
      <Route path="/users" component={Users} />
      <Route path="/categories" component={Categories} />
      <Route path="/courses/add" component={AddCourse} />
      <Route path="/courses/admin" component={AdminCourses} />
      <Route path="/courses" component={Courses} />
      <Route path="/comemnts" component={Comments} />
      {/* <Route path="/payments" component={Payments} /> */}
    </Switch>
  );
};
