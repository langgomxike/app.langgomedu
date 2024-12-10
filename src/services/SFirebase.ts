import {initializeApp, FirebaseApp} from 'firebase/app';
import {getDatabase, ref, onValue, Database, update, push} from 'firebase/database';
import firebaseConfig from "../../firebase_account_service.json";
import SLog, {LogType} from './SLog';
import general_infors from "../constants/general_infos.json";

export enum FirebaseNode {
  AppInfos = "general_infos",
  Addresses = "addresses",
  Attendances = "attendances",
  Certificates = "certificates",
  ClassLevels = "class_levels",
  ClassMembers = "class_members",
  Classes = "classes",
  CVs = "cvs",
  Educations = "educations",
  Experiences = "experiences",
  Files = "files",
  Genders = "genders",
  InterestedClassLevels = "interested_class_levels",
  InterestedMajors = "interested_majors",
  Lessons = "lessons",
  Majors = "majors",
  Messages = "messages",
  Notifications = "notifications",
  OTPs = "otps",
  Permissions = "permissions",
  Ratings = "ratings",
  ReportFiles = "report_files",
  Reports = "reports",
  RolePermission = "role_permission",
  Roles = "roles",
  Statuses = "statuses",
  UserRole = "user_role",
  Users = "users",
  Id = "id",
  ClassId = "class_id",
  LessonId = "lesson_id",
  UserId = "user_id",
  FromUserId = "from_user_id",
  ToUserId = "to_user_id",
  MessageId = "message_id",
  ClassLevelId = "class_level_id",
  MajorId = "major_id",
  GenderId = "gender_id",
  CertificateId = "certificate_id",
  EducationId = "education_id",
  ExperienceId = "experience_id",
  ReportId = "report_id",
  RoleId = "role_id",
  PermissionId = "permission_id",
  StatusId = "status_id",
  ReportFileId = "report_file_id",
  FileId = "file_id",
  OTPId = "otp_id",
}

export default class SFirebase {
  private static app: FirebaseApp;
  private static firebaseDatabase: Database;

  private static init() {
    if (!this.app) {
      this.app = initializeApp(firebaseConfig);
      SLog.log(LogType.Warning, "Initializing Firebase", "initialed app");
    }

    if (!this.firebaseDatabase) {
      this.firebaseDatabase = getDatabase(this.app);
      SLog.log(LogType.Warning, "Initializing Firebase", "initialed database");
    }
  }

  /*
  Example using:
  useEffect(() => {
    SFirebase.track(FirebaseNode.ReportFiles, [{key: FirebaseNode.Id, value: 123}], () => {
      api here
    });
  }, []);
   */
  public static track(parentNode: FirebaseNode, keyNodes: {
    key: FirebaseNode,
    value: string | number
  }[], onNext: () => void) {
    this.init();
    let node = `${parentNode}/${keyNodes.map((keyNode) => `${keyNode.key}:${keyNode.value}`).join("|")}`;
    const firebaseReference = ref(this.firebaseDatabase, node);

    onValue(firebaseReference,
      (data) => {
        SLog.log(
          LogType.Info,
          `track ${parentNode}`,
          `track the ${parentNode} with key ${node} successfully`,
        );
        onNext();
      },
      (error) => {
        SLog.log(
          LogType.Info,
          `track ${parentNode}`,
          `track the ${parentNode} with key ${node} successfully found error`,
          error
        );
        onNext();
      }
    );
  }

  public static getAppInfos(onNext:(infos: typeof general_infors) => void) {
    this.init();
    const firebaseReference = ref(this.firebaseDatabase, FirebaseNode.AppInfos);

    onValue(firebaseReference,
      (data) => {
        // SLog.log(
        //   LogType.Info,
        //   `track ${FirebaseNode.AppInfos}`,
        //   `track the ${FirebaseNode.AppInfos} successfully`,
        // );
        onNext(data.val());
      },
      (error) => {
        // SLog.log(
        //   LogType.Info,
        //   `track ${FirebaseNode.AppInfos}`,
        //   `track the ${FirebaseNode.AppInfos} successfully found error`,
        //   error
        // );
        onNext(general_infors);
      }
    );
  }

  public static setAppInfos(infos: typeof general_infors, onNext: () => void) {
    this.init();
    const node = FirebaseNode.AppInfos;
    const firebaseReference = ref(this.firebaseDatabase, node);

    update(firebaseReference, infos)
      .then(() => {
        // SLog.log(
        //   LogType.Info,
        //   `push ${node}`,
        //   `push the ${node} successfully`,
        // );
      })
      .catch((error) => {
        SLog.log(
          LogType.Info,
          `push ${node}`,
          `push the ${node} successfully found error`,
          error
        );
      })
      .finally(onNext);
  }

  public static setNewList(array: string[], key: string, name: string, onNext?: () => void) {
    this.init();
    const node = FirebaseNode.AppInfos + "/" + key;
    const firebaseReference = ref(this.firebaseDatabase, node);

    const data = {
      [name]: array
    }

    update(firebaseReference, data)
      .then(() => {
        SLog.log(
          LogType.Info,
          `push ${node}`,
          `push the ${node} successfully`,
        );
      })
      .catch((error) => {
        SLog.log(
          LogType.Info,
          `push ${node}`,
          `push the ${node} successfully found error`,
          error
        );
      })
      .finally(onNext);
  }
}