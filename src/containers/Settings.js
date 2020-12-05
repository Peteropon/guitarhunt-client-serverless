import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { API } from "aws-amplify";
import { onError } from "../libs/errorLib";
import config from "../config";
import { Elements, StripeProvider } from "react-stripe-elements";
import BillingForm from "../components/BillingForm";
import "./Settings.css";
import { toast } from "react-toastify";
import { Jumbotron } from "react-bootstrap";

export default function Settings() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    setStripe(window.Stripe(config.STRIPE_KEY));
  }, []);

  function billUser(details) {
    return API.post("guitars", "/billing", {
      body: details,
    });
  }

  async function handleFormSubmit(storage, { token, error }) {
    if (error) {
      onError(error);
      return;
    }

    setIsLoading(true);

    try {
      await billUser({
        storage,
        source: token.id,
      });

      toast.success("Your card has been charged successfully!");
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="Settings">
      <Jumbotron>
        Here you can choose the amount of posts you want to do. (Don't worry
        this won't charge you for real)
      </Jumbotron>
      <StripeProvider stripe={stripe}>
        <Elements
          fonts={[
            {
              cssSrc:
                "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800",
            },
          ]}
        >
          <BillingForm isLoading={isLoading} onSubmit={handleFormSubmit} />
        </Elements>
      </StripeProvider>
    </div>
  );
}
