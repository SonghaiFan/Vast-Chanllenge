class GraphFilter:
    @staticmethod
    def filter_graph_by_type(original_graph,node_types, link_types):
        filtered_nodes = [node for node in original_graph['nodes'] if node.get('type') in node_types]
        filtered_nodes_ids = [node.get('id') for node in filtered_nodes]
        filtered_links = [link for link in original_graph['links'] if (link.get('type') in link_types and link.get('source') in filtered_nodes_ids and link.get('target') in filtered_nodes_ids)]
        filtered_graph = original_graph.copy()
        filtered_graph['nodes'] = filtered_nodes
        filtered_graph['links'] = filtered_links
        return filtered_graph