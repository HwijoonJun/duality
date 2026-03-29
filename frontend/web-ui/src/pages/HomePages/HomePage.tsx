import { Component } from "react";

import AuthService from "../../services/auth.service";
import type IUser from "../../types/user.type";

import EventBus from "../../common/EventBus";

import { AppFooter } from '../../components/Footer';
import { AppHeader } from '../../components/Header';
import { Upload } from '../../components/Upload';

type Props = {};

type State = {
  showModeratorBoard: boolean,
  showAdminBoard: boolean,
  currentUser: IUser | undefined
}

export default class HomePage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }

    EventBus.on("logout", this.logOut);
  }

  componentWillUnmount() {
    EventBus.remove("logout", this.logOut);
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render() {
 //   const { currentUser, showModeratorBoard, showAdminBoard } = this.state;

    return (
      <div>

        { /*<AuthVerify logOut={this.logOut}/> */}

		<div className="min-h-screen bg-[#fafafa] flex flex-col">

			<AppHeader />

			<Upload />

			<AppFooter />
		</div>
      </div>

	  
    );
  }
}

