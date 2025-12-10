import { useState } from "react";
import axios from "axios";
import "./Translator.css";

export default function Translator() {
    const [jsonSchema, setJsonSchema] = useState("");
    const [xmlXsd, setXmlXsd] = useState("");
    const [mapping, setMapping] = useState("");

    const [inputMode, setInputMode] = useState("xml");
    const [inputXml, setInputXml] = useState("");
    const [inputJson, setInputJson] = useState("");

    const [outputXml, setOutputXml] = useState("");
    const [loading, setLoading] = useState(false);
    const xsd="<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified">
  <xs:element name="IntegratedPartnerHomeQuote">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="RequestHeader">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="Header">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="SpName" type="xs:string" minOccurs="0"/>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
        <xs:element name="IntegratedPartnetHomeQuoteInput">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="Input">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="ACORD">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="InsuranceSvcRq">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="HomePolicyQuoteReq">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="InsuredOrPrincipal">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="InsuredOrPrincipalInfo">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="ProducerInfo">
                                                    <xs:complexType>
                                                      <xs:sequence>
                                                        <xs:element name="ContractNumber" type="xs:string" minOccurs="0"/>
                                                      </xs:sequence>
                                                    </xs:complexType>
                                                  </xs:element>
                                                  <xs:element name="GeneralPartyInfo">
                                                    <xs:complexType>
                                                      <xs:sequence>
                                                        <xs:element name="NameInfo">
                                                          <xs:complexType>
                                                            <xs:sequence>
                                                              <xs:element name="PersonName">
                                                                <xs:complexType>
                                                                  <xs:sequence>
                                                                    <xs:element name="GivenName" type="xs:string" minOccurs="0"/>
                                                                    <xs:element name="SurName" type="xs:string" minOccurs="0"/>
                                                                  </xs:sequence>
                                                                </xs:complexType>
                                                              </xs:element>
                                                            </xs:sequence>
                                                          </xs:complexType>
                                                        </xs:element>
                                                      </xs:sequence>
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>"

    const jsonSchema="{
  "$schema": http://json-schema.org/draft-07/schema#,
  "title": "PartnerQuote",
  "type": "object",
  "properties": {
    "quoteId": { "type": "string" },
    "partnerId": { "type": "string" },
    "customer": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "contact": { "type": "string" }
      },
      "required": ["name", "contact"]
    },
    "totalAmount": { "type": "number" },
    "currency": { "type": "string" }
  },
  "required": ["quoteId", "partnerId", "customer", "totalAmount", "currency"]
}"

const xml="<PartnerQuote>
  <quoteId>Q123456</quoteId>
  <partnerId>P7890</partnerId>
  <customer>
    <name>Acme Corp</name>
    <contact>john.doe@acme.com</contact>
  </customer>
  <totalAmount>377.5</totalAmount>
  <currency>USD</currency>
</PartnerQuote>
"



    const generateMapping = async () => {
        if (!jsonSchema || !xmlXsd) {
            alert("Please enter both JSON Schema and XML XSD.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("https://organic-giggle-vpv65ggv6v5fx7jq-5000.app.github.dev/generate-mapping", {
                jsonSchema,
                xmlXsd,
            });

            setMapping(response.data.mapping);
        } catch (err) {
            console.error(err);
            alert("Invalid JSON Schema or XML XSD");
        }
        setLoading(false);
    };

    const transformXml = async () => {
        if (!mapping || !xmlXsd) {
            alert("Mapping and XML XSD are required.");
            return;
        }

        if (inputMode === "xml" && !inputXml) {
            alert("Please provide a valid XML Input.");
            return;
        }

        if (inputMode === "json" && !inputJson) {
            alert("Please provide a JSON Input.");
            return;
        }

        setLoading(true);
        try {
            const payload =
                inputMode === "xml"
                    ? { inputXml, mappingJson: mapping, xmlXsd }
                    : { inputJson: JSON.parse(inputJson), mappingJson: mapping, xmlXsd };

            const response = await axios.post("https://organic-giggle-vpv65ggv6v5fx7jq-5000.app.github.dev/transform-xml", payload);

            setOutputXml(response.data);
        } catch (err) {
            console.error(err);
            alert("Error transforming XML");
        }
        setLoading(false);
    };

    return (
        <div>
            <h2 className="heading">Mapping Template Generation</h2>
            <div className="translator-container">
                <div className="row-two-cols">
                    <div className="box">
                        <h3>JSON Schema</h3>
                        <textarea
                            value={jsonSchema}
                            onChange={(e) => setJsonSchema(e.target.value)}
                            placeholder="Paste JSON Schema..."
                        />
                    </div>

                    <div className="box">
                        <h3>XML XSD</h3>
                        <textarea
                            value={xmlXsd}
                            onChange={(e) => setXmlXsd(e.target.value)}
                            placeholder="Paste XML XSD..."
                        />
                    </div>
                </div>

                <div className="button-row">
                    <button disabled={loading} onClick={generateMapping}>
                        {loading ? "Generating..." : "Generate Mapping Template"}
                    </button>
                </div>


                <div className="row-two-cols">
                    <div className="box">
                        <h3>Mapping Template</h3>
                        <textarea
                            value={mapping}
                            onChange={(e) => setMapping(e.target.value)}
                            placeholder="Mapping JSON Appears Here..."
                        />
                    </div>

                    <div className="box">
                        <div className="input-header">
                            <h3 className="quote-heading">Quote Details</h3>
                            <select
                                className="input-toggle"
                                value={inputMode}
                                onChange={(e) => setInputMode(e.target.value)}
                            >
                                <option value="xml">XML</option>
                                <option value="json">JSON</option>
                            </select>
                        </div>

                        {inputMode === "xml" ? (
                            <textarea
                                value={inputXml}
                                onChange={(e) => setInputXml(e.target.value)}
                                placeholder="Paste Input XML..."
                            />
                        ) : (
                            <textarea
                                value={inputJson}
                                onChange={(e) => setInputJson(e.target.value)}
                                placeholder='Paste Input JSON...'
                            />
                        )}
                    </div>
                </div>

                <div className="button-row">
                    <button disabled={loading} onClick={transformXml}>
                        {loading ? "Generating..." : "Generate Quote Request"}
                    </button>
                </div>

                <div className="output-box">
                    <h3>Quote Request</h3>
                    <textarea
                        value={outputXml}
                        readOnly
                        placeholder="Transformed XML Will Appear Here..."
                    />
                </div>
            </div>
        </div>
    );
}
