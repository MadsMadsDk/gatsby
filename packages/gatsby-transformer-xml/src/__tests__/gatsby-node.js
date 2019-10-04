const Promise = require(`bluebird`)

const { onCreateNode } = require(`../gatsby-node`)
describe(`Process XML nodes correctly`, () => {
  const node = {
    name: `nodeName`,
    id: `whatever`,
    parent: null,
    children: [],
    internal: {
      contentDigest: `whatever`,
      mediaType: `application/xml`,
      name: `test`,
    },
  }

  // Make some fake functions its expecting.
  node.content = `
      <?xml version="1.0"?>
      <catalog>
        <book id="bk101">
            <author>Gambardella, Matthew</author>
            <title>XML Developer's Guide</title>
            <genre>Computer</genre>
            <price>44.95</price>
            <publish_date>2000-10-01</publish_date>
            <description>An in-depth look at creating applications
            with XML.</description>
            <description_html><![CDATA[
              <p>An in-depth look at creating applications
            with XML.</p>
            ]]></description_html>
            <publish_date_explicit>
              <year>2000</year>
              <month>
                <month_number>10</month_number>
                <month_name lang="en-gb">October</month_name>
              </month>
              <day>01</day>
            </publish_date_explicit>
         </book>
         <book id="bk102">
            <author>Ralls, Kim</author>
            <title>Midnight Rain</title>
            <genre>Fantasy</genre>
            <price>5.95</price>
            <publish_date>2000-12-16</publish_date>
            <description>A former architect battles corporate zombies,
            an evil sorceress, and her own childhood to become queen
            of the world.</description>
            <description_html><![CDATA[
              <p>A former architect battles <strong>corporate zombies</strong>,
            an evil sorceress, and her own childhood to become queen
            of the world.</p>
            ]]></description_html>
            <publish_date_explicit>
              <year>2000</year>
              <month>
                <month_number>12</month_number>
                <month_name lang="en-gb">December</month_name>
              </month>
              <day>16</day>
            </publish_date_explicit>
         </book>
      </catalog>
    `
  const loadNodeContent = node => Promise.resolve(node.content)

  it(`correctly creates nodes from XML`, async () => {
    const createNode = jest.fn()
    const createParentChildLink = jest.fn()
    const actions = { createNode, createParentChildLink }
    const createNodeId = jest.fn()
    createNodeId.mockReturnValue(`uuid-from-gatsby`)
    const createContentDigest = jest.fn().mockReturnValue(`contentDigest`)

    await onCreateNode(
      {
        node,
        loadNodeContent,
        actions,
        createNodeId,
        createContentDigest,
      },
      {}
    ).then(() => {
      expect(createNode.mock.calls).toMatchSnapshot()
      expect(createParentChildLink.mock.calls).toMatchSnapshot()
      expect(createNode).toHaveBeenCalledTimes(2)
      expect(createParentChildLink).toHaveBeenCalledTimes(2)
    })
  })

  it(`correctly creates nodes from XML using element names for keys`, async () => {
    const createNode = jest.fn()
    const createParentChildLink = jest.fn()
    const actions = { createNode, createParentChildLink }
    const createNodeId = jest.fn()
    createNodeId.mockReturnValue(`uuid-from-gatsby`)
    const createContentDigest = jest.fn().mockReturnValue(`contentDigest`)

    await onCreateNode(
      {
        node,
        loadNodeContent,
        actions,
        createNodeId,
        createContentDigest,
      },
      { useElementNamesAsKeys: true }
    ).then(() => {
      expect(createNode.mock.calls).toMatchSnapshot()
      expect(createParentChildLink.mock.calls).toMatchSnapshot()
      expect(createNode).toHaveBeenCalledTimes(2)
      expect(createParentChildLink).toHaveBeenCalledTimes(2)
    })
  })

  it(`correctly creates nodes from XML with plugin options set`, async () => {
    const createNode = jest.fn()
    const createParentChildLink = jest.fn()
    const actions = { createNode, createParentChildLink }
    const createNodeId = jest.fn()
    createNodeId.mockReturnValue(`uuid-from-gatsby`)
    const createContentDigest = jest.fn().mockReturnValue(`contentDigest`)

    await onCreateNode(
      {
        node,
        loadNodeContent,
        actions,
        createNodeId,
        createContentDigest,
      },
      { useElementNamesAsKeys: true, ignoreDeclaration: false }
    ).then(() => {
      expect(createNode.mock.calls).toMatchSnapshot()
      expect(createParentChildLink.mock.calls).toMatchSnapshot()
      expect(createNode).toHaveBeenCalledTimes(3)
      expect(createParentChildLink).toHaveBeenCalledTimes(3)
    })
  })
})
