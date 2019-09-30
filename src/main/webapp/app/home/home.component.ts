import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LoginModalService, Principal, Account } from 'app/core';
import { CourseService } from 'app/shared/service/CourseService';
import { CourseDto } from 'app/shared/model/course-dto.model';
import { CourseWithTNDto } from 'app/shared/model/courseWithTN-dto.model';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.css']
})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    courses: CourseDto[] = [];
    newCourse: CourseDto = { courseName: null, courseLocation: null, courseContent: null, teacherId: null };
    coursesWithTN: CourseWithTNDto[] = [];

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private courseService: CourseService
    ) {}

    ngOnInit() {
        this.principal.identity().then(account => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.principal.identity().then(account => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    isTeacher() {
        return this.principal.isTeacher();
    }

    isStudent() {
        return this.principal.isStduent();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    getAllCourses() {
        this.courseService.getCourseInfo().subscribe(curDto => {
            if (!curDto) {
                this.courses = [];
            } else {
                this.courses = curDto;
            }
        });
    }

    getAllCoursesWithTN() {
        this.courseService.getCourseInfoWithTN().subscribe(curDto => {
            if (!curDto) {
                this.coursesWithTN = [];
            } else {
                this.coursesWithTN = curDto;
            }
        });
    }

    clearAllCourses() {
        this.courses = [];
    }

    addCourseToStudent(courseName: string) {
        this.courseService.addCourseToStudent(courseName).subscribe(resp => {
            console.log(resp);
        });
    }

    deleteCourse(courseName: string) {
        this.courseService.delete(courseName).subscribe(resp => {
            console.log(resp);
        });
    }

    addNewCourse() {
        console.log(this.newCourse);
        if (
            this.newCourse.teacherId !== null &&
            this.newCourse.courseContent !== null &&
            this.newCourse.courseLocation !== null &&
            this.newCourse.courseName !== null
        ) {
            this.courseService.add(this.newCourse).subscribe(resp => {
                console.log(resp);
            });
        }
    }
}
