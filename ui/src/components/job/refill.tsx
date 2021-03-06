// This file is part of Prusa-Connect-Local
// Copyright (C) 2018-2019 Prusa Research s.r.o. - www.prusa3d.com
// SPDX-License-Identifier: GPL-3.0-or-later

import { h, Component, Fragment } from "preact";
import { Translation } from "react-i18next";
import Title from "../title";
import YesNoView from "./yes-no";
import ExampleImage1 from "../../assets/refill.jpg";
import ExampleImage2 from "../../assets/tank.jpg";
import { PrinterState } from "../telemetry";
import { isPrintingFeedMe } from "../utils/states";

interface S {
  show: number;
}

interface P {
  printer_state: PrinterState;
  onBack(e: Event): void;
}

class Refill extends Component<P, {}> {
  componentDidMount = () => {
    fetch("/api/job/material?value=start", {
      method: "GET",
      headers: {
        "X-Api-Key": process.env.APIKEY
      }
    })
      .then(function(response) {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .catch(e => {
        this.props.onBack(new Event("back"));
      });
  };

  onBack = (e: MouseEvent) => {
    fetch("/api/job/material?value=back", {
      method: "GET",
      headers: {
        "X-Api-Key": process.env.APIKEY
      }
    });
    this.props.onBack(e);
  };

  onYES = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    fetch("/api/job/material?value=continue", {
      method: "GET",
      headers: {
        "X-Api-Key": process.env.APIKEY
      }
    });
    this.props.onBack(e);
  };

  render() {
    const is_disabled = !isPrintingFeedMe(this.props.printer_state);
    return (
      // @ts-ignore
      <Translation useSuspense={false}>
        {(t, { i18n }, ready) =>
          ready && (
            <Fragment>
              <Title title={t("refill.title")} />
              <div class="columns is-multiline is-mobile is-centered is-vcentered">
                <div class="column is-full">
                  <p class="prusa-default-text">{t("msg.sla-fly-fill")}</p>
                </div>
                <div class="column is-full">
                  <div class="columns">
                    <div class="column">
                      <img src={ExampleImage1} />
                    </div>
                    <div class="column">
                      <img src={ExampleImage2} />
                    </div>
                  </div>
                </div>
                <div class="column is-full">
                  <YesNoView
                    no_text={t("btn.no")}
                    onNO={this.onBack}
                    yes_text={t("btn.sla-refilled")}
                    onYES={this.onYES}
                    yes_disabled={is_disabled}
                    no_disabled={is_disabled}
                  />
                </div>
              </div>
            </Fragment>
          )
        }
      </Translation>
    );
  }
}

export default Refill;
