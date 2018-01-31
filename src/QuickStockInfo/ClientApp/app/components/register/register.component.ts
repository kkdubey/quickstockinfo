// ======================================
// Author: Komal Dubey
// Email:  kkdubey12@gmail.com
// ======================================

import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AccountService } from "../../services/account.service";
import { Utilities } from '../../services/utilities';
import { User } from '../../models/user.model';
import { UserEdit } from '../../models/user-edit.model';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';

@Component({
    selector: "app-register",
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

    private isNewUser = true;
    private isSaving = false;
    private showValidationErrors = false;
    private uniqueId: string = Utilities.uniqueId();
    private user: User = new User();
    private userEdit: UserEdit = new UserEdit();
    private allRoles: Role[] = [];

    public formResetToggle = true;

    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;





    @ViewChild('f')
    private form;

    //ViewChilds Required because ngIf hides template variables from global scope
    @ViewChild('userName')
    private userName;

    @ViewChild('userPassword')
    private userPassword;

    @ViewChild('email')
    private email;

    @ViewChild('currentPassword')
    private currentPassword;

    @ViewChild('newPassword')
    private newPassword;

    @ViewChild('confirmPassword')
    private confirmPassword;

    @ViewChild('roles')
    private roles;

    @ViewChild('rolesSelector')
    private rolesSelector;


    constructor(private alertService: AlertService, private accountService: AccountService) {
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            //this.loadCurrentUserData();
        }
    }


    private getRoleByName(name: string) {
        return this.allRoles.find((r) => r.name == name)
    }



    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }


    public deletePasswordFromUser(user: UserEdit | User) {
        let userEdit = <UserEdit>user;

        delete userEdit.currentPassword;
        delete userEdit.newPassword;
        delete userEdit.confirmPassword;
    }




    private save() {
        this.isSaving = true;
        this.alertService.startLoadingMessage("Saving changes...");
        this.accountService.selfUserRegister(this.userEdit).subscribe(user => this.saveSuccessHelper(user), error => this.saveFailedHelper(error));
    }


    private saveSuccessHelper(user?: User) {
        this.testIsRoleUserCountChanged(this.user, this.userEdit);

        if (user)
            Object.assign(this.userEdit, user);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;

        this.deletePasswordFromUser(this.userEdit);
        Object.assign(this.user, this.userEdit);
        this.userEdit = new UserEdit();
        this.resetForm();

        if (this.isNewUser)
        this.alertService.showMessage("Success", `User \"${this.user.userName}\" was created successfully`, MessageSeverity.success);
        


        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }


    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);

        if (this.changesFailedCallback)
            this.changesFailedCallback();
    }



    private testIsRoleUserCountChanged(currentUser: User, editedUser: User) {

        let rolesAdded = this.isNewUser ? editedUser.roles : editedUser.roles.filter(role => currentUser.roles.indexOf(role) == -1);
        let rolesRemoved = this.isNewUser ? [] : currentUser.roles.filter(role => editedUser.roles.indexOf(role) == -1);

        let modifiedRoles = rolesAdded.concat(rolesRemoved);

        if (modifiedRoles.length)
            setTimeout(() => this.accountService.onRolesUserCountChanged(modifiedRoles));
    }



    private cancel() {
        if (this.isGeneralEditor)
            this.userEdit = this.user = new UserEdit();
        else
            this.userEdit = new UserEdit();

        this.showValidationErrors = false;
        this.resetForm();

        this.alertService.showMessage("Cancelled", "Operation cancelled by user", MessageSeverity.default);
        this.alertService.resetStickyMessage();


        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }


    private close() {
        this.userEdit = this.user = new UserEdit();
        this.showValidationErrors = false;
        this.resetForm();

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }
    

    resetForm(replace = false) {
        if (!replace) {
            this.form.reset();
        }
        else {
            this.formResetToggle = false;

            setTimeout(() => {
                this.formResetToggle = true;
            });
        }
    }


    newUser(allRoles: Role[]) {
        this.isGeneralEditor = true;
        this.isNewUser = true;

        this.allRoles = [...allRoles];
        this.user = this.userEdit = new UserEdit();
        this.userEdit.isEnabled = true;

        return this.userEdit;
    }
    

    displayUser(user: User, allRoles?: Role[]) {

        this.user = new User();
        Object.assign(this.user, user);
        this.deletePasswordFromUser(this.user);
        this.setRoles(user, allRoles);

    }



    private setRoles(user: User, allRoles?: Role[]) {

        this.allRoles = allRoles ? [...allRoles] : [];

        if (user.roles) {
            for (let ur of user.roles) {
                if (!this.allRoles.some(r => r.name == ur))
                    this.allRoles.unshift(new Role(ur));
            }
        }

        if (allRoles == null || this.allRoles.length != allRoles.length)
            setTimeout(() => this.rolesSelector.refresh());
    }



    get canViewAllRoles() {
        return this.accountService.userHasPermission(Permission.viewRolesPermission);
    }

    get canAssignRoles() {
        return this.accountService.userHasPermission(Permission.assignRolesPermission);
    }
}